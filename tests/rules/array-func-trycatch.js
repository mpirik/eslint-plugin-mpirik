'use strict';

const rule = require("../../rules/array-func-trycatch");
const RuleTester = require("eslint/lib/testers/rule-tester");

const ruleTester = new RuleTester();
ruleTester.run("array-func-trycatch", rule, {
  valid: [
    "Foo.prototype.bar = [function bar(){ try {} catch (ex) {} }];",
    "[function foo(){ try {} catch (ex) {} }]",
    "[function test(d, e, f) { try {} catch (ex) {} }]"
  ],
  invalid: [
    {
      code: "Foo.prototype.bar = [function() {}];",
      errors: [{
        message: "Missing try/catch block in function.",
        type: "FunctionExpression"
      }]
    }, {
      code: "[function(){}]",
      errors: [{
        message: "Missing try/catch block in function.",
        type: "FunctionExpression"
      }]
    }, {
      code: "[function(){ var x = 5; }]",
      errors: [{
        message: "Missing try/catch block in function.",
        type: "FunctionExpression"
      }]
    }, {
      code: "[function(){ var x = 5; try {} catch (ex) {} }]",
      errors: [{
        message: "Missing try/catch block in function.",
        type: "FunctionExpression"
      }]
    }
  ]
});
