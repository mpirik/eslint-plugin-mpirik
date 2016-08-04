'use strict';

module.exports = {
  meta: {
    docs: {
      description: "Require promise shorthand where possible",
      category: "ECMAScript 6",
      recommended: false,
    },
    fixable: "code",
    schema: [],
  },

  create(context) {
    /**
     * Determines if the node is a promise declaration
     * @param {Object} node - Current ASTNode
     * @returns {boolean} True if node is a promise declaration; Otherwise False
     */
    function isPromise(node) {
      return node.name === 'Promise' && node.parent && node.parent.type === 'NewExpression';
    }

    /**
     * Determines if the promise constructor has arguments
     * @param {Object} node - Promise NewExpression node
     * @returns {boolean} True if the new expression has arguments; Otherwise False
     */
    function hasPromiseConstructorArguments(node) {
      return node.arguments && node.arguments.length;
    }

    /**
     * Determines if the executor is a function
     * @param {Object} node - Promise NewExpression node
     * @returns {boolean} True if the promise body can be shorthand; Otherwise False
     */
    function isExecutorFunction(node) {
      // Promises are supposed to only have one argument. If there are more, we have bigger problems
      if (node.arguments.length !== 1) {
        return false;
      }

      // If the executor isn't a function, bail... this shouldn't be
      return node.arguments[0].type === 'ArrowFunctionExpression' || node.arguments[0].type === 'FunctionExpression';
    }

    /**
     * Determines if the promise body can be shorthand
     * @param {Object} node - Promise executor function body node
     * @returns {boolean} True if the promise body can be shorthand; Otherwise False
     */
    function hasCallExpressionArgument(node) {
      return node && node.type === 'CallExpression' && node.callee && (node.callee.name === 'resolve' || node.callee.name === 'reject');
    }

    /**
     * Determines if the promise body can be shorthand
     * @param {Object} node - Promise executor function body node
     * @returns {boolean} True if the promise body can be shorthand; Otherwise False
     */
    function isSimpleBlockStatement(node) {
      if (node && node.type === 'BlockStatement') {
        const blockBody = node.body;
        if (blockBody && blockBody.length) {
          const returnStatement = blockBody[0];

          if (returnStatement.type === 'ReturnStatement' && returnStatement.argument && returnStatement.argument.type === 'CallExpression') {
            const returnIdentifier = returnStatement.argument.callee;

            return returnIdentifier && (returnIdentifier.name === 'resolve' || returnIdentifier.name === 'reject');
          }
        }
      }

      return false;
    }

    /**
     * Gets the raw arguments that are part of a CallExpression
     * @param {Object} node - CallExpression AST node
     * @param {Object} sourceCode - SourceCode object
     * @returns {string[]} Raw argument names
     */
    function getCallExpressionArguments(node, sourceCode) {
      let allNullArguments = true;
      const args = node.arguments.map((arg) => {
        allNullArguments = allNullArguments && arg.raw === 'null';

        if (arg.raw) {
          return arg.raw;
        }

        return sourceCode.getText(arg);
      });

      if (allNullArguments) {
        return [];
      }

      return args;
    }

    /**
     * Checks the node for rule satisfaction
     * @param {Object} node - Current ASTNode
     */
    function checkNode(node) {

      if (isPromise(node)) {

        const newExpression = node.parent;

        // new Promise(); should be rewritten as Promise.resolve();
        if (!hasPromiseConstructorArguments(newExpression)) {
          return context.report({
            node,
            message: "Expected shorthand promise syntax.",
            fix: (fixer) => {
              return fixer.replaceText(newExpression, 'Promise.resolve()');
            },
          });
        }

        if (isExecutorFunction(newExpression)) {
          const sourceCode = context.getSourceCode();
          const executorBody = newExpression.arguments[0].body;
          // new Promise((resolve) => resolve()) should be rewritten as Promise.resolve()
          if (hasCallExpressionArgument(executorBody)) {

            const args = getCallExpressionArguments(executorBody, sourceCode);

            return context.report({
              node,
              message: `Expected shorthand promise syntax.`,
              fix: (fixer) => {
                return fixer.replaceText(newExpression, `Promise.${executorBody.callee.name}(${args.join(', ')})`);
              },
            });
          }

          // new Promise((resolve) => { return resolve(); }) should be rewritten as Promise.resolve()
          if (isSimpleBlockStatement(executorBody)) {

            const returnIdentifier = executorBody.body[0].argument.callee;
            const args = getCallExpressionArguments(executorBody.body[0].argument, sourceCode);

            return context.report({
              node,
              message: `Expected shorthand promise syntax.`,
              fix: (fixer) => {
                return fixer.replaceText(newExpression, `Promise.${returnIdentifier.name}(${args.join(', ')})`);
              },
            });
          }
        }
      }
    }

    return {
      Identifier: checkNode,
    };
  },
};
