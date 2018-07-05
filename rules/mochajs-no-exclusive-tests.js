'use strict';

module.exports = {
  meta: {
    docs: {
      description: "Prevents exclusive mochajs tests",
      category: "Best Practices",
      recommended: false,
    },
    schema: [],
  },

  create(context) {
    /**
     * Determines if the function is an "it" or "describe" identifier
     * @param {Object} node - Current ASTNode
     * @returns {boolean} True if a mocha identifier; Otherwise False
     */
    function isMochaIdentifier(node) {
      return node.name === 'it' || node.name === 'describe';
    }

    /**
     * Determines if the test(s) are marked as exclusive
     * @param {Object} node - Current ASTNode
     * @returns {boolean} True if the identifier is marked as exclusive; Otherwise False
     */
    function definesExclusiveTest(node) {
      const parent = node.parent;

      if (!parent || parent.type !== 'MemberExpression') {
        return false;
      }

      const exclusiveIdentifier = parent.property;

      return exclusiveIdentifier && exclusiveIdentifier.type === 'Identifier' && exclusiveIdentifier.name === 'only';
    }

    /**
     * Checks the node for rule satisfaction
     * @param {Object} node - Current ASTNode
     */
    function checkNode(node) {
      if (isMochaIdentifier(node) && definesExclusiveTest(node)) {
        context.report(node, "Test(s) marked as exclusive.");
      }
    }

    return {
      Identifier: checkNode,
    };
  },
};
