/* eslint-env mocha */
import { expect } from 'chai';
import { evaluate as evaluateFeel } from 'feelin';

import evaluate from '../../src/interpreter/index.js';
import { compile } from '../../src/compiler/compiler.js';

import { allFixtures } from '../fixtures.js';

describe('fixtures', () => {
  Object.entries(allFixtures).forEach(([ _, { name, template, context, expected } ]) => {
    it(`compiled '${name}' should match direct interpreter output and expected output`, () => {
      const directTemplateEvaluation = evaluate(template, context);
      const compiledFeel = compile(template);
      const compiledFeelEvaluation = evaluateFeel(`${compiledFeel}`, context);
      expect(directTemplateEvaluation).to.equal(expected, 'Direct evaluation mismatch');
      expect(compiledFeelEvaluation).to.equal(directTemplateEvaluation, 'Compiled FEEL evaluation mismatch');
    });
  });
});
