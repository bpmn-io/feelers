import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
globalThis.expect = chai.expect;
globalThis.sinon = sinon;
