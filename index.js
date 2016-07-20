'use strict';

const arrayFuncNames = require('./rules/array-func-names.js');
const arrayFuncTrycatch = require('./rules/array-func-trycatch.js');
const asyncjsFuncTrycatch = require('./rules/asyncjs-func-trycatch.js');
const cojsRequireCatch = require('./rules/cojs-require-catch.js');
const catchName = require('./rules/catch-name.js');
const moachajsNoExclusiveTests = require('./rules/mochajs-no-exclusive-tests.js');
const validJsdoc = require('./rules/valid-jsdoc.js');
const sailsjsControllerActionParams = require('./rules/sailsjs-controller-action-params.js');

module.exports = {
  rules: {
    'array-func-names': arrayFuncNames,
    'array-func-trycatch': arrayFuncTrycatch,
    'asyncjs-func-trycatch': asyncjsFuncTrycatch,
    'catch-name': catchName,
    'cojs-require-catch': cojsRequireCatch,
    'moachajs-no-exclusive-tests': moachajsNoExclusiveTests,
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
