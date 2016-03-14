# eslint-plugin-mpirik

ESLint rules and configuration that extends [airbnb](https://github.com/airbnb/javascript)'s configuration

### array-func-names: `2`
Enforces function names for functions defined in an array.

### array-func-trycatch: `2`
Enforces try/catch block inside functions defined in an array

### asyncjs-func-trycatch: `2`
Enforces try/catch block inside function iteratees for asyncjs collection iterators like `async.each`

Enforce try/catch block inside callback:
```javascript
  "mpirik/asyncjs-func-trycatch": [2, {checkCallback: true}]
```

### catch-name: `[2, 'ex']`
Enforce the name of the exception variable created in a catch block.

Allow multiple parameter names:
```javascript
  "mpirik/catch-name": [2, '^(ex|exception)']
```


## Usage

* `npm install --save-dev eslint-plugin-mpirik eslint`
* Add `plugins` section and specify eslint-plugin-mpirik as a plugin:

```javascript
{
  "plugins": [
    "mpirik"
  ]
}
```

* Use `recommended` configuration for default rules or specify rules explicitly


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
    "mpirik/array-func-name": 2
  }
```

## Useful links
I found these links useful while writing rules:

* http://eslint.org/docs/developer-guide/working-with-rules
* http://astexplorer.net/
