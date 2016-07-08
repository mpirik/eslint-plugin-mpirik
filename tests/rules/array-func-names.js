'use strict';

const rule = require("../../rules/array-func-names");
/* eslint-disable import/no-extraneous-dependencies */
const RuleTester = require("eslint/lib/testers/rule-tester");
/* eslint-enable import/no-extraneous-dependencies */

const ruleTester = new RuleTester();
ruleTester.run("array-func-names", rule, {
  valid: [
    "Foo.prototype.bar = [function bar(){}];",
    {
      code: "Foo.prototype.bar = [() => {}];",
      parserOptions: {
        ecmaVersion: 6,
      },
    },
    "[function foo(){}]",
    "[function test(d, e, f) {}]",
  ],
  invalid: [
    {
      code: "Foo.prototype.bar = [function() {}];",
      errors: [{
        message: "Missing function expression name.",
        type: "FunctionExpression",
      }],
    }, {
      code: "[function(){}]",
      errors: [{
        message: "Missing function expression name.",
        type: "FunctionExpression",
      }],
    },
  ],
});
