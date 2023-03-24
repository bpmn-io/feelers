import { parser as feelParser } from 'lezer-feel';
import { parser as templateParser } from '../../grammar/parser.js';
import { parseMixed } from '@lezer/common';
import { LRLanguage, foldNodeProp, foldInside } from '@codemirror/language';

const foldMetadata = {
  ConditionalSpanner: foldInside,
  LoopSpanner: foldInside
};

function createMixedLanguage(hostLanguage = null) {
  const _mixedParser = templateParser.configure({

    wrap: parseMixed(node => {

      if (node.name == 'Feel' || node.name == 'FeelBlock') {
        return { parser: feelParser };
      }

      if (hostLanguage && node.name == 'SimpleTextBlock') {
        return { parser: hostLanguage };
      }

      return null;
    }),

    props: [
      foldNodeProp.add(foldMetadata)
    ]
  });

  return LRLanguage.define({ parser: _mixedParser });
}

export { createMixedLanguage };