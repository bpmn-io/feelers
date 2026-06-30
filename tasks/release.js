#!/usr/bin/env node

/**
 * Publish changed packages to npm in dependency order.
 *
 * Phase 1 — Detect: find packages with changes since their last publish tag.
 * Phase 2 — Plan:   ask for a semver bump per changed package (or skip).
 * Phase 3 — Execute (headless): build, test, publish, tag.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Topological order — dependencies must appear before their dependents.
const PACKAGES = [
  'lezer-feelers',
  'feelers-lint',
  'feelers',
  'lang-feelers',
  'feelers-editor'
];

// ─── helpers ────────────────────────────────────────────────────────────────

function exec(cmd, opts = {}) {
  const result = execSync(cmd, { encoding: 'utf-8', ...opts });
  return typeof result === 'string' ? result.trim() : result;
}

function readPackage(dir) {
  return JSON.parse(readFileSync(join(ROOT, 'packages', dir, 'package.json'), 'utf-8'));
}

function getNpmVersion(name) {
  try {
    return exec(`npm view ${name} version`);
  } catch {
    return null;
  }
}

function findPublishTag(name, version) {
  for (const tag of [ `${name}@${version}`, `v${version}` ]) {
    try {
      exec(`git rev-parse ${tag} --`);
      return tag;
    } catch { /* not found */ }
  }
  return null;
}

function hasChangesSince(tag, relativeDir) {
  return exec(`git log ${tag}..HEAD -- ${relativeDir}`).length > 0;
}

function bumpVersion(version, bump) {
  const [ major, minor, patch ] = version.split('.').map(Number);
  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  if (bump === 'patch') return `${major}.${minor}.${patch + 1}`;
  throw new Error(`unknown bump type: ${bump}`);
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

// ─── phase 1: detect ────────────────────────────────────────────────────────

console.log('Detecting changes...\n');

const changed = [];
const changingNames = new Set(); // names confirmed for release so far (topological order)

for (const dir of PACKAGES) {
  const pkg = readPackage(dir);
  const { name } = pkg;
  const npmVersion = getNpmVersion(name);

  let reason = null;

  if (!npmVersion) {
    reason = 'not yet published';
  } else {
    const tag = findPublishTag(name, npmVersion);

    if (!tag) {
      console.warn(`  warning: ${name}@${npmVersion} — no git tag found, skipping`);
      console.warn(`  Create tag '${name}@${npmVersion}' or 'v${npmVersion}' to enable change detection.\n`);
      continue;
    }

    if (hasChangesSince(tag, `packages/${dir}`)) {
      reason = `changes since ${tag}`;
    }
  }

  // Cascade: include this package if a workspace dependency is being released.
  // Safe to check here because PACKAGES is in topological order — all deps
  // have already been evaluated by the time we reach a dependent.
  if (!reason) {
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
    const changedDep = [ ...changingNames ].find(n => n in allDeps);
    if (changedDep) reason = `dep ${changedDep} changing`;
  }

  if (reason) {
    changed.push({ dir, name, currentVersion: npmVersion || '0.0.0', reason });
    changingNames.add(name);
  }
}

if (changed.length === 0) {
  console.log('Nothing to publish.');
  process.exit(0);
}

console.log('Changed packages:');
for (const { name, currentVersion, reason } of changed) {
  console.log(`  ${name}@${currentVersion} — ${reason}`);
}

// ─── phase 2: plan ──────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });

console.log('\nHow should each package be bumped? [patch / minor / major / skip]\n');

const plan = [];

for (const pkg of changed) {
  const { name, currentVersion } = pkg;
  const bumps = {
    patch: bumpVersion(currentVersion, 'patch'),
    minor: bumpVersion(currentVersion, 'minor'),
    major: bumpVersion(currentVersion, 'major'),
  };
  const hint = `patch=${bumps.patch} minor=${bumps.minor} major=${bumps.major}`;

  let bump;
  while (true) {
    const answer = await ask(rl, `  ${name} (${hint}): `);
    if ([ 'patch', 'minor', 'major', 'skip' ].includes(answer)) {
      bump = answer;
      break;
    }
    console.log('  Please enter patch, minor, major, or skip.');
  }

  if (bump === 'skip') continue;
  plan.push({ ...pkg, bump, newVersion: bumpVersion(currentVersion, bump) });
}

rl.close();

if (plan.length === 0) {
  console.log('\nNothing to publish.');
  process.exit(0);
}

console.log('\nRelease plan:');
for (const { name, currentVersion, newVersion, bump } of plan) {
  console.log(`  ${name}: ${currentVersion} → ${newVersion} (${bump})`);
}
const skipped = changed.filter(c => !plan.find(p => p.dir === c.dir));
if (skipped.length) {
  console.log(`  skipped: ${skipped.map(s => s.name).join(', ')}`);
}

// ─── phase 3: execute ───────────────────────────────────────────────────────

for (const { dir, name, newVersion } of plan) {
  console.log(`\n${name}@${newVersion}`);

  // Bump this package's version.
  exec(`npm version ${newVersion} --no-git-tag-version`, { cwd: join(ROOT, 'packages', dir) });

  // Pin the new version in every workspace package that depends on this one.
  const stagedPaths = [ `packages/${dir}/package.json` ];
  for (const otherDir of PACKAGES) {
    if (otherDir === dir) continue;
    const pkgPath = join(ROOT, 'packages', otherDir, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    let dirty = false;

    for (const field of [ 'dependencies', 'devDependencies', 'peerDependencies' ]) {
      if (!pkg[field] || !(name in pkg[field])) continue;
      pkg[field][name] = `^${newVersion}`;
      dirty = true;
    }

    if (dirty) {
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
      stagedPaths.push(`packages/${otherDir}/package.json`);
    }
  }

  // Install to resolve the updated ranges and update the lockfile.
  exec(`npm install`, { cwd: ROOT, stdio: 'inherit' });

  // Commit version bump + dependency pins + lockfile together.
  for (const p of stagedPaths) exec(`git add ${p}`);
  exec(`git add package-lock.json`);
  exec(`git commit -m "chore: release ${name}@${newVersion}"`);

  // Build and test against the committed state.
  exec(`npm run all`, { cwd: join(ROOT, 'packages', dir), stdio: 'inherit' });

  // Publish and tag.
  exec(`npm publish --access public`, { cwd: join(ROOT, 'packages', dir), stdio: 'inherit' });

  const tag = `${name}@${newVersion}`;
  exec(`git tag ${tag}`);
  exec(`git push origin ${tag}`);
  console.log(`  tagged ${tag}`);
}

exec(`git push origin HEAD`);
console.log('\nDone.');
