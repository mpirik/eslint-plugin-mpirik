var rule = require("../../rules/array-func-names");
var RuleTester = require("eslint/lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("array-func-names", rule, {
  valid: [
    "Foo.prototype.bar = [function bar(){}];",
    {
      code: "Foo.prototype.bar = [() => {}];",
      parserOptions: {
        ecmaVersion: 6
      }
    },
    "[function foo(){}]",
    "[function test(d, e, f) {}]"
  ],
  invalid: [
    {
      code: "Foo.prototype.bar = [function() {}];",
      errors: [{
        message: "Missing function expression name.",
        type: "FunctionExpression"
      }]
    }, {
      code: "[function(){}]",
      errors: [{
        message: "Missing function expression name.",
        type: "FunctionExpression"
      }]
    }
  ]
});
