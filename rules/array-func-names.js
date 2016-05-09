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

  return {
    FunctionExpression(node) {

      const name = node.id && node.id.name;

      if (!name && isWithinArray()) {
        context.report(node, "Missing function expression name.");
      }
    }
  };
};

module.exports.schema = [];
