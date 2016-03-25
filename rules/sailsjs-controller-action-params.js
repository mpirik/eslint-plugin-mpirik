module.exports = function (context) {

  /**
   * Determines if the function has more than 2 parameters
   * @param {Object} node - Current ASTNode
   * @returns {boolean} True if the function has more than 2 parameters; Otherwise False
   */
  function hasMoreThanTwoParameters(node) {
    return node.params.length > 2;
  }

  /**
   * Determines if the function is part of a property definition
   * @param {Object} node - Current ASTNode
   * @returns {boolean} True if the function is a property definition; Otherwise False
   */
  function isPropertyDefinition(node) {
    var parent = node.parent;

    return parent && parent.type === 'Property';
  }

  /**
   * Determines if the function is part of a property definition for a module.exports statement
   * @param {Object} node - Current ASTNode
   * @returns {boolean} True if the function is a property definition for module.exports; Otherwise False
   */
  function isModuleExportsProperty(node) {
    var property = node.parent;

    if (!property) {
      return false;
    }

    var objectExpression = property.parent;

    if (!objectExpression || objectExpression.type !== 'ObjectExpression') {
      return false;
    }

    var assignmentExpression = objectExpression.parent;

    if (!assignmentExpression || assignmentExpression.type !== 'AssignmentExpression') {
      return false;
    }

    return assignmentExpression.left.type === 'MemberExpression' && assignmentExpression.left.property && assignmentExpression.left.property.name === 'exports';
  }

  /**
   * Checks the node for rule satisfaction
   * @param {Object} node - Current ASTNode
   */
  function checkNode(node) {
    if (hasMoreThanTwoParameters(node) && isPropertyDefinition(node) && isModuleExportsProperty(node)) {
      context.report(node, "Invalid parameters defined for sailsjs controller action.");
    }
  }

  return {
    "FunctionExpression": checkNode,
    "ArrowFunctionExpression": checkNode
  };
};

module.exports.schema = [];
