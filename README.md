# eslint-plugin-mpirik

ESLint rules and configuration that extends [airbnb](https://github.com/airbnb/javascript)'s configuration

### array-func-names: `2`
Enforces function names for functions defined in an array.

### catch-name: `[2, 'ex']`
Enforce the name of the exception variable created in a catch block.

Allow multiple parameter names:
```javascript
  "eslint-plugin-mpirik/catch-name": [2, '^(ex|exception)']
```

## Usage

1. `npm install --save-dev eslint-plugin-mpirik eslint`
2. Add `plugins` section and specify eslint-plugin-mpirik as a plugin:

```javascript
{
  "plugins": [
    "mpirik"
  ]
}
```

3. Use `recommended` configuration for default rules or specify rules explicitly


```javascript
{
  "plugins": [
    "mpirik"
  ],
  "extends": ["plugin:mpirik/recommended"]
}
```

or

```javascript
  "rules": {
    "eslint-plugin-mpirik/array-func-name": 2
  }
```
