'use strict';

const rule = require("../../rules/cojs-wrap-should-be-assignment");
/* eslint-disable import/no-extraneous-dependencies */
const RuleTester = require("eslint/lib/testers/rule-tester");
/* eslint-enable import/no-extraneous-dependencies */

const ruleTester = new RuleTester();
ruleTester.run("cojs-wrap-should-be-assignment", rule, {
  valid: [
    {
      code: "module.exports.foo = co.wrap(function* bar() {});",
      parserOptions: {
        ecmaVersion: 6,
      },
    },
  ],
  invalid: [
    {
      code: "function foo() { return co.wrap(function* bar() {}); }",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "co.wrap should only be used as an assignment.",
        type: "Identifier",
      }],
    }, {
      code: "co.wrap(function* bar() {}).then(() => {});",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "co.wrap should only be used as an assignment.",
        type: "Identifier",
      }],
    },
  ],
});
