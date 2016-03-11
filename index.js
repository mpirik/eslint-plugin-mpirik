module.exports = {
  extends: [
    'eslint-config-airbnb/legacy'
  ].map(require.resolve),
  rules: {
    'array-func-names': require('./rules/array-func-names.js'),
    'catch-name': require('./rules/catch-name.js')
  },
  configs: {
    recommended: {
      rules: {
        'mpirik/array-func-names': 2,
        'mpirik/catch-name': 2
      }
    }
  }
};
