/* global console */

import {
  Feel,
  FeelBlock,
  SimpleTextBlock
} from './parser.terms.js';

import {
  ExternalTokenizer
} from '@lezer/lr';

const LOG_PARSE_DEBUG = true;

const CHAR_TABLE = {
  '{': 123,
  '}': 125
};

const isClosingFeelScope = (input, offset = 0) => {

  const isReadingCloseCurrent = input.peek(offset) === CHAR_TABLE['}'];
  const isReadingCloseAhead = input.peek(offset + 1) === CHAR_TABLE['}'];

  const isReadingClose = isReadingCloseCurrent && isReadingCloseAhead;

  return isReadingClose || input.peek(offset) === -1;

};

export const feelBlock = new ExternalTokenizer((input, stack) => {

  LOG_PARSE_DEBUG && console.log('%s: T <feelBlock>', input.pos);

  let lookAhead = 0;

  // check if we haven't reached the end of a templating tag
  while (!isClosingFeelScope(input, lookAhead)) { lookAhead++; }

  if (lookAhead > 0) {
    input.advance(lookAhead);
    input.acceptToken(FeelBlock);
  }

});

const isClosingTextScope = (input, offset = 0) => {
  const isReadingOpenCurrent = input.peek(offset) === CHAR_TABLE['{'];
  const isReadingOpenAhead = input.peek(offset + 1) === CHAR_TABLE['{'];

  const isReadOpen = isReadingOpenCurrent && isReadingOpenAhead;

  return isReadOpen || input.peek(offset) === -1;
};


export const simpleTextBlock = new ExternalTokenizer((input, stack) => {

  LOG_PARSE_DEBUG && console.log('%s: T <simpleTextBlock>', input.pos);

  let lookAhead = 0;

  // check if we haven't reached the start of a templating tag
  while (!isClosingTextScope(input, lookAhead)) { lookAhead++; }

  if (lookAhead > 0) {
    input.advance(lookAhead);
    input.acceptToken(SimpleTextBlock);
  }

});

// Anytime this tokenizer is run, simply tag the rest of the input as FEEL
export const feel = new ExternalTokenizer((input, stack) => {

  LOG_PARSE_DEBUG && console.log('%s: T <feel>', input.pos);

  let lookAhead = 0;

  while (input.peek(lookAhead) !== -1) { lookAhead++; }

  if (lookAhead > 0) {

    console.log(lookAhead);

    input.advance(lookAhead);
    input.acceptToken(Feel);
  }

});