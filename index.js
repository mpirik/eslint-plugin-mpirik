module.exports = {
  extends: [
    'eslint-config-airbnb/legacy'
  ].map(require.resolve),
  rules: {
    'array-func-names': require('./rules/array-func-names.js'),
    'catch-name': require('./rules/catch-name.js')
  },
  rulesConfig: {
    'array-func-names': 2,
    'catch-name': 2
  }
};
