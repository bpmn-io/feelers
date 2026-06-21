import { parser as feelParser } from '@bpmn-io/lezer-feel';
import { parser as feelersParser } from 'feelers/parser';

import { parseMixed } from '@lezer/common';
import { LRLanguage, foldNodeProp, foldInside } from '@codemirror/language';

const foldMetadata = {
  ConditionalSpanner: foldInside,
  LoopSpanner: foldInside
};

/**
 * @param {import('@lezer/lr').LRParser} [hostParser=null]
 *
 * @return {LRLanguage}
 */
function createMixedLanguage(hostParser = null) {
  const _mixedParser = feelersParser.configure({

    wrap: parseMixed(node => {

      if (node.name == 'Feel' || node.name == 'FeelBlock') {
        return { parser: feelParser };
      }

      if (hostParser && node.name == 'SimpleTextBlock') {
        return { parser: hostParser };
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