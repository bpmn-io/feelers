import { styleTags, tags as t } from '@lezer/highlight';

export const feelersHighlighting = styleTags({
  ConditionalSpanner: t.special(t.bracket),
  LoopSpanner: t.special(t.bracket),
  Insert: t.special(t.bracket),
});