module.exports = function (context) {

  var checkCallback = context.options[0] && context.options[0].checkCallback;
  var asyncIterators = ['each', 'eachSeries', 'eachLimit', 'forEachOf', 'forEachOfSeries', 'forEachOfLimit', 'map', 'mapSeries', 'mapLimit', 'filter', 'filterSeries', 'filterLimit', 'reject', 'rejectSeries', 'rejectLimit', 'reduce', 'reduceRight', 'detect', 'detectSeries', 'detectLimit', 'sortBy', 'some', 'someLimit', 'someSeries', 'every', 'everyLimit', 'everySeries', 'concat', 'concatSeries'];

  /**
   * Determines if the function is defined as a parameter to an asyncjs iterator like async.each
   * @param {object} node - Current ASTNode
   * @returns {boolean} True if the current context is withing an asyncjs iterator; Otherwise false
   */
  function isWithinAsyncIterator(node) {
    var parent = context.getAncestors().pop();

    // If the function is not a parameter to a function, abort
    if (parent.type !== 'CallExpression') {
      return false;
    }

    // If there is no callee details, abort
    if (!parent.callee || !parent.callee.object || !parent.callee.property) {
      return false;
    }

    // If we're not in an iterator call, abort
    if (parent.callee.object.name !== 'async' || asyncIterators.indexOf(parent.callee.property.name) === -1) {
      return false;
    }

    // If we're checking the callback, we will just check all functions specified
    if (checkCallback) {
      return true;
    }

    // If the last two arguments of the CallExpression are functions, assume the last is the callback and second to last is the iteratee
    var hasCallbackDefined = parent.arguments.length > 2 && parent.arguments[parent.arguments.length - 1].type === 'FunctionExpression' && parent.arguments[parent.arguments.length - 2].type === 'FunctionExpression';

    // Return true if there is no callback defined or this is the iteratee function definition
    return !hasCallbackDefined || parent.arguments[parent.arguments.length - 1].start !== node.start;
  }

  /**
   * Determines if the function has a defined body with the content wrapped in a try/catch block
   * @param {object} node - Current ASTNode
   * @returns {boolean} True if the function body is wrapped in try/catch; Otherwise False
   */
  function hasBlockStatementWithTryCatchDefined(node) {
    var blockStatement = node.body;

    // If there isn't a function body defined, assume things are kosher
    if (!blockStatement || blockStatement.type !== 'BlockStatement') {
      return true;
    }

    var tryStatement = blockStatement.body[0];

    return tryStatement && tryStatement.type === 'TryStatement';
  }

  return {
    "FunctionExpression": function (node) {

      if (isWithinAsyncIterator(node) && !hasBlockStatementWithTryCatchDefined(node)) {
        context.report(node, "Missing try/catch block in function.");
      }
    }
  };
};

module.exports.schema = [{
  "type": "object",
  "properties": {
    "checkCallback": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}];
