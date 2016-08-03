'use strict';

const doctrine = require("doctrine");

module.exports = {
  meta: {
    docs: {},

    schema: [{
      type: "object",
      properties: {
        prefer: {
          type: "object",
          additionalProperties: {
            type: "string",
          },
        },
        preferType: {
          type: "object",
          additionalProperties: {
            type: "string",
          },
        },
        requireReturn: {
          type: "boolean",
        },
        requireReturnWhenReturnPresent: {
          type: "boolean",
        },
        requireParamDescription: {
          type: "boolean",
        },
        requireReturnDescription: {
          type: "boolean",
        },
        matchParamDescription: {
          type: "string",
        },
        matchDescription: {
          type: "string",
        },
        requireReturnType: {
          type: "boolean",
        },
      },
      additionalProperties: false,
    }],
  },

  create(context) {

    const options = context.options[0] || {};
    const prefer = options.prefer || {};
    const sourceCode = context.getSourceCode();

    // these default to true, so you have to explicitly make them false
    const requireReturn = options.requireReturn !== false;
    const requireReturnWhenReturnPresent = options.requireReturnWhenReturnPresent !== false;
    const requireParamDescription = options.requireParamDescription !== false;
    const requireReturnDescription = options.requireReturnDescription !== false;
    const requireReturnType = options.requireReturnType !== false;
    const preferType = options.preferType || {};
    const checkPreferType = Object.keys(preferType).length !== 0;

    let matchParamDescription;
    if (options.matchParamDescription) {
      matchParamDescription = new RegExp(options.matchParamDescription);
    }

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    // Using a stack to store if a function returns or not (handling nested functions)
    const fns = [];

    /**
     * Check if node type is a Class
     * @param {Object} node - node to check.
     * @returns {boolean} True is its a class
     * @private
     */
    function isTypeClass(node) {
      return node.type === "ClassExpression" || node.type === "ClassDeclaration";
    }

    /**
     * When parsing a new function, store it in our function stack.
     * @param {Object} node - A function node to check.
     * @returns {void}
     * @private
     */
    function startFunction(node) {
      fns.push({
        returnPresent: (node.type === "ArrowFunctionExpression" && node.body.type !== "BlockStatement") ||
        isTypeClass(node),
      });
    }

    /**
     * Indicate that return has been found in the current function.
     * @param {Object} node - The return node.
     * @returns {void}
     * @private
     */
    function addReturn(node) {
      const functionState = fns[fns.length - 1];

      if (functionState && node.argument !== null) {
        functionState.returnPresent = true;
      }
    }

    /**
     * Check if return tag type is void or undefined
     * @param {Object} tag - JSDoc tag
     * @returns {boolean} True if its of type void or undefined
     * @private
     */
    function isValidReturnType(tag) {
      return tag.type === null || tag.type.name === "void" || tag.type.type === "UndefinedLiteral";
    }

    /**
     * Check if type should be validated based on some exceptions
     * @param {Object} type - JSDoc tag
     * @returns {boolean} True if it can be validated
     * @private
     */
    function canTypeBeValidated(type) {
      return type !== "UndefinedLiteral" && // {undefined} as there is no name property available.
        type !== "NullLiteral" && // {null}
        type !== "NullableLiteral" && // {?}
        type !== "FunctionType" && // {function(a)}
        type !== "AllLiteral"; // {*}
    }

    /**
     * Extract the current and expected type based on the input type object
     * @param {Object} type - JSDoc tag
     * @returns {Object} current and expected type object
     * @private
     */
    function getCurrentExpectedTypes(type) {
      let currentType;

      if (type.name) {
        currentType = type.name;
      } else {
        currentType = type.expression.name;
      }

      const expectedType = preferType[currentType];

      return {
        currentType,
        expectedType,
      };
    }

    /**
     * Check if return tag type is void or undefined
     * @param {Object} tag - JSDoc tag
     * @param {Object} jsdocNode - JSDoc node
     * @returns {void}
     * @private
     */
    function validateTagType(tag, jsdocNode) {
      if (!tag.type || !canTypeBeValidated(tag.type.type)) {
        return;
      }

      const typesToCheck = [];
      let elements = [];

      if (tag.type.type === "TypeApplication") { // {Array.<String>}
        elements = tag.type.applications[0].type === "UnionType" ? tag.type.applications[0].elements : tag.type.applications;
        typesToCheck.push(getCurrentExpectedTypes(tag.type));
      } else if (tag.type.type === "RecordType") { // {{20:String}}
        elements = tag.type.fields;
      } else if (tag.type.type === "UnionType") { // {String|number|Test}
        elements = tag.type.elements;
      } else {
        typesToCheck.push(getCurrentExpectedTypes(tag.type));
      }

      elements.forEach((type) => {
        type = type.value ? type.value : type; // we have to use type.value for RecordType
        if (canTypeBeValidated(type.type)) {
          typesToCheck.push(getCurrentExpectedTypes(type));
        }
      });

      typesToCheck.forEach((type) => {
        if (type.expectedType &&
          type.expectedType !== type.currentType) {
          context.report({
            node: jsdocNode,
            message: "Use '{{expectedType}}' instead of '{{currentType}}'.",
            data: {
              currentType: type.currentType,
              expectedType: type.expectedType,
            },
          });
        }
      });
    }

    /**
     * Validate the JSDoc node and output warnings if anything is wrong.
     * @param {Object} node - The AST node to check.
     * @returns {void}
     * @private
     */
    function checkJSDoc(node) {
      const jsdocNode = sourceCode.getJSDocComment(node);
      const functionData = fns.pop();
      let hasReturns = false;
      let hasConstructor = false;
      let isInterface = false;
      let isOverride = false;
      const params = Object.create(null);
      let jsdoc;

      // make sure only to validate JSDoc comments
      if (jsdocNode) {

        try {
          jsdoc = doctrine.parse(jsdocNode.value, {
            strict: true,
            unwrap: true,
            sloppy: true,
          });
        } catch (ex) {

          if (/braces/i.test(ex.message)) {
            context.report(jsdocNode, "JSDoc type missing brace.");
          } else {
            context.report(jsdocNode, "JSDoc syntax error.");
          }

          return;
        }

        jsdoc.tags.forEach((tag) => {

          switch (tag.title.toLowerCase()) {

            case "param":
            case "arg":
            case "argument":
              if (!tag.type) {
                context.report(jsdocNode, "Missing JSDoc parameter type for '{{name}}'.", {
                  name: tag.name,
                });
              }

              if (!tag.description && requireParamDescription) {
                context.report(jsdocNode, "Missing JSDoc parameter description for '{{name}}'.", {
                  name: tag.name,
                });
              }

              if (matchParamDescription && !matchParamDescription.test(tag.description)) {
                context.report(jsdocNode, "JSDoc parameter description for '{{name}}' does not satisfy the regex pattern.\n{{tag}}", {
                  tag: JSON.stringify(tag),
                  name: tag.name,
                });
              }

              if (params[tag.name]) {
                context.report(jsdocNode, "Duplicate JSDoc parameter '{{name}}'.", {
                  name: tag.name,
                });
              } else if (tag.name.indexOf(".") === -1) {
                params[tag.name] = 1;
              }
              break;

            case "return":
            case "returns":
              hasReturns = true;

              if (!requireReturnWhenReturnPresent && !functionData.returnPresent && (tag.type === null || !isValidReturnType(tag))) {
                context.report(jsdocNode, `Unexpected @${tag.title} tag; function has no return statement.`);
              } else {
                if (requireReturnType && !tag.type) {
                  context.report(jsdocNode, "Missing JSDoc return type.");
                }

                if (!isValidReturnType(tag) && !tag.description && requireReturnDescription) {
                  context.report(jsdocNode, "Missing JSDoc return description.");
                }
              }

              break;

            case "constructor":
            case "class":
              hasConstructor = true;
              break;

            case "override":
            case "inheritdoc":
              isOverride = true;
              break;

            case "interface":
              isInterface = true;
              break;

            // no default
          }

          // check tag preferences
          if ({}.hasOwnProperty.call(prefer, tag.title) && tag.title !== prefer[tag.title]) {
            context.report(jsdocNode, "Use @{{name}} instead.", {
              name: prefer[tag.title],
            });
          }

          // validate the types
          if (checkPreferType) {
            validateTagType(tag, jsdocNode);
          }
        });

        // check for functions missing @returns
        if (requireReturn) {
          if (!isOverride && !hasReturns && !hasConstructor && !isInterface &&
            node.parent.kind !== "get" && node.parent.kind !== "constructor" &&
            node.parent.kind !== "set" && !isTypeClass(node)) {
            if (requireReturnWhenReturnPresent || functionData.returnPresent) {
              context.report(jsdocNode, `Missing JSDoc @${(prefer.returns || "returns")} for function.`);
            }
          }
        }

        // check the parameters
        const jsdocParams = Object.keys(params);

        if (node.params) {
          node.params.forEach((param, i) => {
            const name = param.name;

            // TODO(nzakas): Figure out logical things to do with destructured, default, rest params
            if (param.type === "Identifier") {
              if (jsdocParams[i] && (name !== jsdocParams[i])) {
                context.report(jsdocNode, "Expected JSDoc for '{{name}}' but found '{{jsdocName}}'.", {
                  name,
                  jsdocName: jsdocParams[i],
                });
              } else if (!params[name] && !isOverride) {
                context.report(jsdocNode, "Missing JSDoc for parameter '{{name}}'.", {
                  name,
                });
              }
            }
          });
        }

        if (options.matchDescription) {
          const regex = new RegExp(options.matchDescription);

          if (!regex.test(jsdoc.description)) {
            context.report(jsdocNode, "JSDoc description does not satisfy the regex pattern.");
          }
        }

      }

    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
      ArrowFunctionExpression: startFunction,
      FunctionExpression: startFunction,
      FunctionDeclaration: startFunction,
      ClassExpression: startFunction,
      ClassDeclaration: startFunction,
      "ArrowFunctionExpression:exit": checkJSDoc,
      "FunctionExpression:exit": checkJSDoc,
      "FunctionDeclaration:exit": checkJSDoc,
      "ClassExpression:exit": checkJSDoc,
      "ClassDeclaration:exit": checkJSDoc,
      ReturnStatement: addReturn,
    };

  },
};