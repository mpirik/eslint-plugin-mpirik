'use strict';

const rule = require("../../rules/cojs-require-catch");
/* eslint-disable import/no-extraneous-dependencies */
const RuleTester = require("eslint/lib/testers/rule-tester");
/* eslint-enable import/no-extraneous-dependencies */

const ruleTester = new RuleTester();
ruleTester.run("cojs-require-catch", rule, {
  valid: [
    {
      code: "co(function* foo() {}).catch(res.negotiate);",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "function bar() { return co(function* foo() {}).catch(res.negotiate); }",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "co(function* foo() {}).catch((ex) => { bar(); });",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "co(function* foo() {}).then(success, error);",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "function bar() { return co(function* foo() {}).then(() => {}, () => {}); }",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "co(function* foo() {}).then(function() {}, function() {});",
      parserOptions: {
        ecmaVersion: 6,
      },
    },
  ],
  invalid: [
    {
      code: "co(function* foo() {})",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Missing catch statement for co function call.",
        type: "FunctionExpression",
      }],
    }, {
      code: "function bar() { return co(function* foo() {}); }",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Missing catch statement for co function call.",
        type: "FunctionExpression",
      }],
    },
  ],
});
