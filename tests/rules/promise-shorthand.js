'use strict';

const rule = require("../../rules/promise-shorthand");
/* eslint-disable import/no-extraneous-dependencies */
const RuleTester = require("eslint/lib/testers/rule-tester");
/* eslint-enable import/no-extraneous-dependencies */

const ruleTester = new RuleTester();
ruleTester.run("promise-shorthand", rule, {
  valid: [
    "new Promise(function(resolve, reject) { foo(function (err) { if (err) { return reject(err); } return resolve(); }); });",
    {
      code: "new Promise((resolve, reject) => { foo((err) => { if (err) { return reject(err); } return resolve(); }); });",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "Promise.resolve()",
      parserOptions: {
        ecmaVersion: 6,
      },
    }, {
      code: "Promise.reject()",
      parserOptions: {
        ecmaVersion: 6,
      },
    },
  ],
  invalid: [
    {
      code: "new Promise()",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Expected shorthand promise syntax.",
        type: "Identifier",
      }],
    }, {
      code: "new Promise((resolve) => resolve())",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Expected shorthand promise syntax.",
        type: "Identifier",
      }],
    }, {
      code: "new Promise((resolve, reject) => reject())",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Expected shorthand promise syntax.",
        type: "Identifier",
      }],
    }, {
      code: "new Promise((resolve) => { return resolve(); })",
      parserOptions: {
        ecmaVersion: 6,
      },
      errors: [{
        message: "Expected shorthand promise syntax.",
        type: "Identifier",
      }],
    },
  ],
});
