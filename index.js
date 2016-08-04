'use strict';

const arrayFuncNames = require('./rules/array-func-names.js');
const arrayFuncTrycatch = require('./rules/array-func-trycatch.js');
const asyncjsFuncTrycatch = require('./rules/asyncjs-func-trycatch.js');
const cojsRequireCatch = require('./rules/cojs-require-catch.js');
const cojsWrapShouldBeAssignment = require('./rules/cojs-wrap-should-be-assignment.js');
const catchName = require('./rules/catch-name.js');
const mochajsNoExclusiveTests = require('./rules/mochajs-no-exclusive-tests.js');
const noCallbackInGenerator = require('./rules/no-callback-in-generator.js');
const promiseShorthand = require('./rules/promise-shorthand.js');
const validJsdoc = require('./rules/valid-jsdoc.js');
const sailsjsControllerActionParams = require('./rules/sailsjs-controller-action-params.js');

module.exports = {
  rules: {
    'array-func-names': arrayFuncNames,
    'array-func-trycatch': arrayFuncTrycatch,
    'asyncjs-func-trycatch': asyncjsFuncTrycatch,
    'catch-name': catchName,
    'cojs-require-catch': cojsRequireCatch,
    'cojs-wrap-should-be-assignment': cojsWrapShouldBeAssignment,
    'mochajs-no-exclusive-tests': mochajsNoExclusiveTests,
    'no-callback-in-generator': noCallbackInGenerator,
    'promise-shorthand': promiseShorthand,
    'valid-jsdoc': validJsdoc,
    'sailsjs-controller-action-params': sailsjsControllerActionParams,
  },
  configs: {
    recommended: {
      rules: {
        'mpirik/array-func-names': 2,
        'mpirik/array-func-trycatch': 2,
        'mpirik/asyncjs-func-trycatch': 2,
        'mpirik/catch-name': 2,
        'mpirik/cojs-require-catch': 2,
        'mpirik/cojs-wrap-should-be-assignment': 2,
        'mpirik/no-callback-in-generator': 2,
        'mpirik/promise-shorthand': 2,
        'mpirik/valid-jsdoc': [2, {
          prefer: {
            return: "returns",
          },
          requireParamDescription: false,
          requireReturn: false,
          requireReturnDescription: false,
        }],
      },
    },
  },
};
