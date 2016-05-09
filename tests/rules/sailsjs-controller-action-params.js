'use strict';

const rule = require("../../rules/sailsjs-controller-action-params");
const RuleTester = require("eslint/lib/testers/rule-tester");

const ruleTester = new RuleTester();
ruleTester.run("sailsjs-controller-action-params", rule, {
  valid: [
    "module.exports = {lorem: function (req, res) { }};",
    "module.exports = {ipsum: function (req) { }};",
    "function lorem(a, b, c) {}",
    "[function test(d, e, f) { }]",
    {
      code: "module.exports = {lorem: (req, res) => {} };",
      parserOptions: {
        ecmaVersion: 6
      }
    }
  ],
  invalid: [
    {
      code: "module.exports = {lorem: function (req, res, next) { }};",
      errors: [{
        message: "Invalid parameters defined for sailsjs controller action: next",
        type: "FunctionExpression"
      }]
    }, {
      code: "module.exports = {lorem: (req, res, next) => {} };",
      parserOptions: {
        ecmaVersion: 6
      },
      errors: [{
        message: "Invalid parameters defined for sailsjs controller action: next",
        type: "ArrowFunctionExpression"
      }]
    }
  ]
});
