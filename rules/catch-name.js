module.exports = function (context) {

  var parameterName = context.options[0] || 'ex';
  var isPattern = parameterName[0] === '^';

  /**
   * Checks if the given name matches the configured parameter name.
   * @returns {boolean} True if the name is a match.
   */
  function matchesParameterName(name) {
    if (isPattern) {
      var regex = new RegExp(parameterName);
      return regex.test(name);
    }

    return name === parameterName;
  }

  return {
    "CatchClause": function (node) {

      if (!matchesParameterName(node.param.name)) {
        context.report(node, "Invalid variable name for catch block parameter.", {
          name: node.param.name
        });
      }

    }
  };
};

module.exports.schema = [];
