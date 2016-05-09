'use strict';

module.exports = function (context) {

  /**
   * Determines whether the current FunctionExpression node is a shorthand method in an array.
   * @returns {boolean} True if the node is a shorthand method in an array.
   */
  function isWithinArray() {
    const parent = context.getAncestors().pop();

    return parent.type === "ArrayExpression";
  }

  /**
   * Determines if the function has a defined body with the content wrapped in a try/catch block
   * @param {object} node - Current ASTNode
   * @returns {boolean} True if the function body is wrapped in try/catch; Otherwise False
   */
  function hasBlockStatementWithTryCatchDefined(node) {
    const blockStatement = node.body;

    // If there isn't a function body defined, assume things are kosher
    if (!blockStatement || blockStatement.type !== 'BlockStatement') {
      return true;
    }

    const tryStatement = blockStatement.body[0];

    return tryStatement && tryStatement.type === 'TryStatement';
  }

  return {
    FunctionExpression(node) {

      if (isWithinArray() && !hasBlockStatementWithTryCatchDefined(node)) {
        context.report(node, "Missing try/catch block in function.");
      }
    }
  };
};

module.exports.schema = [];
