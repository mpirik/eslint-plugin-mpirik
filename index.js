'use strict';

const catchName = require('./rules/catch-name.js');
const mochajsNoExclusiveTests = require('./rules/mochajs-no-exclusive-tests.js');
const noCallbackInGenerator = require('./rules/no-callback-in-generator.js');
const promiseShorthand = require('./rules/promise-shorthand.js');

module.exports = {
  rules: {
    'catch-name': catchName,
    'mochajs-no-exclusive-tests': mochajsNoExclusiveTests,
    'no-callback-in-generator': noCallbackInGenerator,
    'promise-shorthand': promiseShorthand,
  },
  configs: {
    recommended: {
      rules: {
        'mpirik/catch-name': "error",
        'mpirik/no-callback-in-generator': "error",
        'mpirik/promise-shorthand': "error",
      },
    },
  },
};
