var rule = require("../../rules/asyncjs-func-trycatch");
var RuleTester = require("eslint/lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("asyncjs-func-trycatch", rule, {
  valid: [
    "async.each([], function(item, cb) { try {} catch (ex) {} }, function (err) {});",
    "async.eachSeries([], function(item, cb) { try {} catch (ex) {} }, function (err) {});",
    "async.eachLimit([], 10, function(item, cb) { try {} catch (ex) {} }, function (err) {});",
    "async.waterfall([], function (err) {});",
    {
      code: "async.each([], function(item, cb) { try {} catch (ex) {} }, function (err) { try {} catch (ex) {} });",
      options: [{
        checkCallback: true
      }]
    },
    "somethingElse.each([], function(item, cb) {}, function (err) {});",
  ],
  invalid: [
    {
      code: "async.each([], function(item, cb) { cb(); }, function (err) {});",
      errors: [{
        message: "Missing try/catch block in function.",
        type: "FunctionExpression"
      }]
    }, {
      code: "async.each([], function(item, cb) { cb(); try {} catch (ex) {} }, function (err) {});",
      errors: [{
        message: "Missing try/catch block in function.",
        type: "FunctionExpression"
      }]
    }, {
      code: "async.each([], function(item, cb) { try {} catch (ex) {} }, function (err) {});",
      options: [{
        checkCallback: true
      }],
      errors: [{
        message: "Missing try/catch block in function.",
        type: "FunctionExpression"
      }]
    }
  ]
});
