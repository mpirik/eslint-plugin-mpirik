'use strict';

const RuleTester = require("eslint/lib/testers/rule-tester");
const rule = require("../../rules/no-callback-in-generator");
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-enable import/no-extraneous-dependencies */

const ruleTester = new RuleTester();
ruleTester.run("no-callback-in-generator", rule, {
  valid: [
    "function foo() { function bar() {} }",
    {
      code: "function foo() { bar((err) => {}); }",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "function* foo() { yield new Promise((resolve) => { return resolve(); });}",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "function* foo() { bar.map((item) => { return bar.name; }); }",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "function* foo() { yield bar.foobar(); }",
      parserOptions: {
        ecmaVersion: 6,
      },
    },
  ],
  invalid: [
    {
      code: "function* foo() { bar.foobar((err) => {}); }",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Callback defined inside of a generator function.",
        type: "ArrowFunctionExpression",
      }],
    }, {
      code: "function* foo() { bar.foobar(function (err) {}); }",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Callback defined inside of a generator function.",
        type: "FunctionExpression",
      }],
    },
  ],
});
