import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { afterEach } from 'vitest';
import TestContainer from './testContainer.js';

// Setup sinon-chai
chai.use(sinonChai);

// Make chai assertions available globally
global.expect = chai.expect;
global.sinon = sinon;

// Clean up test containers after each test
afterEach(() => {
  TestContainer.cleanup();
});
