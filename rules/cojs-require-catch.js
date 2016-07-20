'use strict';

module.exports = {
  meta: {
    docs: {},
    schema: [],
  },

  create(context) {
    /**
     * Determines if the function is part of a call expression
     * @param {Object} node - Current ASTNode
     * @returns {boolean} True if the function is a call expression; Otherwise False
     */
    function isCallExpression(node) {
      const parent = node.parent;

      return parent && parent.type === 'CallExpression';
    }

    /**
     * Determines if the function is an argument to a co call expression
     * @param {Object} node - Current ASTNode
     * @returns {boolean} True if the function is an argument to a co call expression; Otherwise False
     */
    function isArgumentToCoCallExpression(node) {
      const callExpression = node.parent;

      if (!callExpression) {
        return false;
      }

      if (!callExpression.callee || callExpression.callee.type !== 'Identifier') {
        return false;
      }

      return callExpression.callee.name === 'co';
    }

    /**
     * Determines if the function is part of a MemberExpression with .catch
     * @param {Object} node - Current ASTNode
     * @returns {boolean} True if the function is an argument to a co call expression; Otherwise False
     */
    function isMemberExpressionWithCatchIdentifier(node) {
      const callExpression = node.parent;

      if (!callExpression || callExpression.type !== 'CallExpression') {
        return false;
      }

      const memberExpression = callExpression.parent;

      if (!memberExpression || memberExpression.type !== 'MemberExpression') {
        return false;
      }

      return memberExpression.property && memberExpression.property.type === 'Identifier' && (memberExpression.property.name === 'catch' || memberExpression.property.name === 'then');
    }

    /**
     * Checks the node for rule satisfaction
     * @param {Object} node - Current ASTNode
     */
    function checkNode(node) {

      if (isCallExpression(node) && isArgumentToCoCallExpression(node) && !isMemberExpressionWithCatchIdentifier(node)) {
        context.report(node, "Missing catch statement for co function call.");
      }
    }

    return {
      FunctionExpression: checkNode,
    };
  },
};
