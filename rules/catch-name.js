'use strict';

module.exports = {
  meta: {
    docs: {},

    schema: [{
      type: "string",
    }],
  },

  create(context) {

    const parameterName = context.options[0] || 'ex';
    const isPattern = parameterName[0] === '^';
    /**
     * Checks if the given name matches the configured parameter name.
     * @returns {boolean} True if the name is a match.
     */
    function matchesParameterName(name) {
      if (isPattern) {
        const regex = new RegExp(parameterName);
        return regex.test(name);
      }

      return name === parameterName;
    }

    return {
      CatchClause(node) {

        if (!matchesParameterName(node.param.name)) {
          context.report(node, "Invalid variable name for catch block parameter.", {
            name: node.param.name,
          });
        }

      },
    };
  },
};
