module.exports = {
  rules: {
    'array-func-names': require('./rules/array-func-names.js'),
    'array-func-trycatch': require('./rules/array-func-trycatch.js'),
    'asyncjs-func-trycatch': require('./rules/asyncjs-func-trycatch.js'),
    'catch-name': require('./rules/catch-name.js')
  },
  configs: {
    recommended: {
      rules: {
        'mpirik/array-func-names': 2,
        'mpirik/array-func-trycatch': 2,
        'mpirik/asyncjs-func-trycatch': 2,
        'mpirik/catch-name': 2
      }
    }
  }
};
