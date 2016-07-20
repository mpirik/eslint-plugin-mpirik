'use strict';

const rule = require("../../rules/mochajs-no-exclusive-tests");
/* eslint-disable import/no-extraneous-dependencies */
const RuleTester = require("eslint/lib/testers/rule-tester");
/* eslint-enable import/no-extraneous-dependencies */

const ruleTester = new RuleTester();
ruleTester.run("mochajs-no-exclusive-tests", rule, {
  valid: [
    "describe('foo', function() {});",
    "it('foo', function() {});",
    "something.only('foo', function() {});",
    {
      code: "describe('foo', () => {});",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "it('foo', () => {});",
      parserOptions: {
        ecmaVersion: 6,
      },
    },
  ],
  invalid: [
    {
      code: "describe.only('foo', function() {});",
      errors: [{
        message: "Test(s) marked as exclusive.",
        type: "Identifier",
      }],
    }, {
      code: "describe.only('foo', () => {});",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Test(s) marked as exclusive.",
        type: "Identifier",
      }],
    }, {
      code: "it.only('foo', function() {});",
      errors: [{
        message: "Test(s) marked as exclusive.",
        type: "Identifier",
      }],
    }, {
      code: "it.only('foo', () => {});",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Test(s) marked as exclusive.",
        type: "Identifier",
      }],
    },
  ],
});
