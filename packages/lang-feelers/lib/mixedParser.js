import { parser as feelParser } from '@bpmn-io/lezer-feel';
import { parser as feelersParser } from '@bpmn-io/lezer-feelers';

import { parseMixed } from '@lezer/common';
import { LRLanguage, foldNodeProp, foldInside } from '@codemirror/language';

const foldMetadata = {
  ConditionalSpanner: foldInside,
  LoopSpanner: foldInside
};

/**
 * @param { import('@lezer/common').Parser } [hostParser=null]
 *
 * @return {LRLanguage}
 */
function createMixedLanguage(hostParser = undefined) {
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
