'use strict';

module.exports = {
  meta: {
    docs: {},
    schema: [],
  },

  create(context) {
    /**
     * Determines if the identifier is part of co.wrap(...)
     * @param {Object} node - Current ASTNode
     * @returns {boolean} True if a co.wrap identifier; Otherwise False
     */
    function isWrapIdentifier(node) {
      if (node.name !== 'wrap') {
        return false;
      }

      const parent = node.parent;

      if (!parent || parent.type !== 'MemberExpression') {
        return false;
      }

      const objectIdentifier = parent.object;

      return objectIdentifier && objectIdentifier.name === 'co';
    }

    /**
     * Determines if co.wrap is part of an assignment. Eg. module.exports.something = co.wrap(...);
     * @param {Object} node - Current ASTNode
     * @returns {boolean} True if the identifier is part of an assignment; Otherwise False
     */
    function isPartOfAssignmentExpression(node) {
      const callExpression = node.parent.parent;

      if (!callExpression || callExpression.type !== 'CallExpression') {
        return false;
      }

      const assignmentExpression = callExpression.parent;

      return assignmentExpression && assignmentExpression.type === 'AssignmentExpression' && assignmentExpression.operator === '=';
    }

    /**
     * Checks the node for rule satisfaction
     * @param {Object} node - Current ASTNode
     */
    function checkNode(node) {

      if (isWrapIdentifier(node) && !isPartOfAssignmentExpression(node)) {
        context.report(node, "co.wrap should only be used as an assignment.");
      }
    }

    return {
      Identifier: checkNode,
    };
  },
};
