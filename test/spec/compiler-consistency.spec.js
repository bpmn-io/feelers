/* eslint-env mocha */
import { expect } from 'chai';
import { evaluate as evaluateFeel } from 'feelin';

import evaluate from '../../src/interpreter/index.js';
import { compile } from '../../src/compiler/compiler.js';

import { allFixtures } from '../fixtures.js';

describe('compiler-consistency', () => {
  Object.entries(allFixtures).forEach(([ _, { name, template, context } ]) => {
    it(`compiled '${name}' should match direct interpreter output`, () => {
      const directTemplateEvaluation = evaluate(template, context);
      const compiledFeel = compile(template);
      const compiledFeelEvaluation = evaluateFeel(`${compiledFeel}`, context);
      expect(compiledFeelEvaluation).to.equal(directTemplateEvaluation);
    });
  });
});
