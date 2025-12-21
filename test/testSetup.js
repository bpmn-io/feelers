const chaiNamespace = require('chai');
const sinonNamespace = require('sinon');
const sinonChaiNamespace = require('sinon-chai');

const chai = chaiNamespace.expect ? chaiNamespace : chaiNamespace.default;
const sinon = sinonNamespace.default || sinonNamespace;
const sinonChai = sinonChaiNamespace.default || sinonChaiNamespace;

chai.use(sinonChai);

const root = typeof window !== 'undefined' ? window : globalThis;

root.chai = chai;
root.expect = chai.expect;
root.assert = chai.assert;
root.sinon = sinon;

if (typeof chai.should === 'function') {
  root.should = chai.should();
}
