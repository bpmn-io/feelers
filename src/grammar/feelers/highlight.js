import { styleTags, tags as t } from '@lezer/highlight';

export const feelersHighlighting = styleTags({
  ConditionalSpanner: t.special(t.string),
  LoopSpanner: t.special(t.string),
  Insert: t.special(t.string),
});