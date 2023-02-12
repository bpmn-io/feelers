import { styleTags, tags as t } from '@lezer/highlight';

export const feelersHighlighting = styleTags({
  SimpleTextBlock: t.string,
  ConditionalSpanner: t.special(t.string),
  LoopSpanner: t.special(t.string),
  Insert: t.special(t.string),
  FeelBlock: t.special(t.comment),
  Feel: t.special(t.comment),
});