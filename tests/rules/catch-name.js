var rule = require("../../rules/catch-name");
var RuleTester = require("eslint/lib/testers/rule-tester");

var ruleTester = new RuleTester();
ruleTester.run("catch-name", rule, {
  valid: [
    "try {} catch (ex) {}",
    {
      code: "try {} catch (exception) {}",
      options: ["^(ex|exception)$"]
    },
    {
      code: "try {} catch (funk) {}",
      options: ["funk"]
    }
  ],
  invalid: [{
    code: "try {} catch (funk) {}",
    errors: [{
      message: "Invalid variable name for catch block parameter.",
      type: "CatchClause"
    }]
  }, {
    code: "try {} catch (except) {}",
    errors: [{
      message: "Invalid variable name for catch block parameter.",
      type: "CatchClause"
    }]
  }]
});
