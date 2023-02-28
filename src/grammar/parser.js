// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {feel, feelBlock, simpleTextBlock} from "./tokens"
import {feelersHighlighting} from "./highlight"
export const parser = LRParser.deserialize({
  version: 14,
  states: "$bOQOaOOOfOXO'#CbOOO`'#Cm'#CmOqOWO'#CcOvOWO'#CfOOO`'#Cp'#CpOOO`'#Ci'#CiO{OaO'#ClO!jOSOOQOOOOOO!oOPO,58{O!tOXO,58|OOO`,58|,58|O!|OQO,58}O#ROQO,59QOOO`-E6g-E6gOOO`1G.g1G.gO#WOPO1G.gOOO`1G.h1G.hO#]OaO1G.iO#qOaO1G.lOOO`7+$R7+$RO$VOPO7+$TO$_OPO7+$WOOO`<<Go<<GoOOO`<<Gr<<Gr",
  stateData: "$g~ORUO_WObPOeROgSO^`P~OQYO_ZOc[O~OQ]O~OQ^O~ORUObPOeROgSO^`XW`XX`XZ`X[`X~OPXO~Oc`O~OQaOcbO~OfcO~OfdO~OceO~ORUObPOeROgSOW`PX`P~ORUObPOeROgSOZ`P[`P~OWhOXhO~OZiO[iO~O",
  goto: "!ZePPPPPfflPPlPPrPPz!TPP!TXQOVcdXTOVcdUVOcdR_VQXOQfcRgdXUOVcd",
  nodeNames: "⚠ Feel FeelBlock SimpleTextBlock Feelers Insert EmptyInsert ConditionalSpanner ConditionalSpannerClose ConditionalSpannerCloseNl LoopSpanner LoopSpannerClose LoopSpannerCloseNl",
  maxTerm: 23,
  propSources: [feelersHighlighting],
  skippedNodes: [0],
  repeatNodeCount: 1,
  tokenData: "%X~RR!_!`[#o#pa#q#r$r~aO_~~dP#o#pg~lQb~str!P!Q!{~uQ#]#^{#`#a!^~!OP#Y#Z!R~!UPpq!X~!^Oe~~!aP#c#d!d~!gP#c#d!j~!mP#d#e!p~!sPpq!v~!{Og~~#OQ#]#^#U#`#a#u~#XP#Y#Z#[~#_P#q#r#b~#eP#q#r#h~#mPW~YZ#p~#uOX~~#xP#c#d#{~$OP#c#d$R~$UP#d#e$X~$[P#q#r$_~$bP#q#r$e~$jPZ~YZ$m~$rO[~R$uP#q#r$xR%PPcPfQYZ%SQ%XOfQ",
  tokenizers: [0, 1, feel, feelBlock, simpleTextBlock],
  topRules: {"Feelers":[0,4]},
  tokenPrec: 0
})
