import './testSetup.js';

// @ts-ignore-next-line
var allTests = import.meta.webpackContext('.', {
  recursive: true,
  regExp: /.spec\.js$/
});

allTests.keys().forEach(allTests);