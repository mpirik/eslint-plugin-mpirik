'use strict';

module.exports = {
  meta: {
    docs: {
      description: "Prevents callback usage inside of a generator function",
      category: "ECMAScript 6",
      recommended: false,
    },
    schema: [],
  },

  create(context) {
    /**
     * Determines if the function is defined inside of a generator function
     * @param {Object} node - Current ASTNode
     * @returns {boolean} True if function is inside a generator function; Otherwise False
     */
    function isInGenerator(node) {
      let parent = node.parent;
      while (parent !== null) {
        if (parent.type === 'ArrowFunctionExpression') {
          return false;
        }

        if (parent.type === 'FunctionDeclaration') {
          return parent.generator;
        }

        // Allow the case where a callback is defined in a promise
        if (parent.type === 'NewExpression' && parent.callee.type === 'Identifier' && parent.callee.name === 'Promise') {
          return false;
        }

        parent = parent.parent;
      }

      return false;
    }

    /**
     * Checks the node for rule satisfaction
     * @param {Object} node - Current ASTNode
     */
    function checkNode(node) {

      if (isInGenerator(node)) {
        context.report(node, "Callback defined inside of a generator function.");
      }
    }

    return {
      ArrowFunctionExpression: checkNode,
      FunctionExpression: checkNode,
    };
  },
};
