import { styleTags, tags as t } from '@lezer/highlight';

export const feelersHighlighting = styleTags({
  ConditionalSpanner: t.special(t.bracket),
  ConditionalSpannerClose: t.special(t.bracket),
  ConditionalSpannerCloseNl: t.special(t.bracket),
  LoopSpanner: t.special(t.bracket),
  LoopSpannerClose: t.special(t.bracket),
  LoopSpannerCloseNl: t.special(t.bracket),
  EmptyInsert: t.special(t.bracket),
  Insert: t.special(t.bracket),
});