import { parser as feelParser } from 'lezer-feel';
import { parser as markdownParser } from '@lezer/markdown';
import { parser as templateParser } from '../../grammar/parser.js';
import { parseMixed } from '@lezer/common';
import { LRLanguage, foldNodeProp, foldInside } from '@codemirror/language';

const _mixedParser = templateParser.configure({

  wrap: parseMixed(node => {

    if (node.name == 'Feel' || node.name == 'FeelBlock') {
      return { parser: feelParser };
    }

    if (node.name == 'SimpleTextBlock') {
      return { parser: markdownParser };
    }

    return null;
  }),

  props: [
    foldNodeProp.add(foldMetadata)
  ]

});

const foldMetadata = {
  ConditionalSpanner: foldInside,
  LoopSpanner: foldInside
};

export default LRLanguage.define({ parser: _mixedParser });
