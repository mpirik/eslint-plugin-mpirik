'use strict';

const RuleTester = require("eslint/lib/testers/rule-tester");
const rule = require("../../rules/catch-name");
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-enable import/no-extraneous-dependencies */

const ruleTester = new RuleTester();
ruleTester.run("catch-name", rule, {
  valid: [
    "try {} catch (ex) {}",
    {
      code: "try {} catch (exception) {}",
      options: ["^(ex|exception)$"],
    },
    {
      code: "try {} catch (funk) {}",
      options: ["funk"],
    },
  ],
  invalid: [{
    code: "try {} catch (funk) {}",
    errors: [{
      message: "Invalid variable name for catch block parameter.",
      type: "CatchClause",
    }],
  }, {
    code: "try {} catch (except) {}",
    errors: [{
      message: "Invalid variable name for catch block parameter.",
      type: "CatchClause",
    }],
  }],
});
