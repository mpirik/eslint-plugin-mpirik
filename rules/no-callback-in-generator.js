'use strict';

module.exports = {
  meta: {
    docs: {
      description: "Prevents callback usage inside of a generator function",
      category: "ECMAScript 6",
      recommended: false,
    },
    schema: [{
      type: 'string',
    }],
  },

  create(context) {
    // Only check callbacks with the first parameter matching the following
    const errorArgument = context.options[0] || "err";

    /**
     * Determines if the first parameter is an error argument
     * @param {Object[]} params - Parameter AST nodes
     * @returns {boolean} True if is an error argument; otherwise False
     */
    function hasErrorParameter(params) {
      if (!params || !params.length) {
        return false;
      }

      const paramName = params[0].name;

      if (errorArgument[0] === '^') {
        const regexp = new RegExp(errorArgument);
        return regexp.test(paramName);
      }

      return paramName === errorArgument;
    }

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
      const params = node.params;
      if (hasErrorParameter(params) && isInGenerator(node)) {
        context.report(node, "Callback defined inside of a generator function.");
      }
    }

    return {
      ArrowFunctionExpression: checkNode,
      FunctionExpression: checkNode,
    };
  },
};
