# eslint-plugin-mpirik

ESLint rules and configuration that extends [airbnb](https://github.com/airbnb/javascript)'s configuration

### catch-name: `[2, 'ex']`
Enforce the name of the exception variable created in a catch block.

Allow multiple parameter names:
```javascript
  "mpirik/catch-name": [2, '^(ex|exception)']
```

### mochajs-no-exclusive-tests: `2`
Prevents [exclusive mochajs tests](https://mochajs.org/#exclusive-tests)

### no-callback-in-generator: `2`
Prevents callback usage inside of a generator function

### promise-shorthand: `2`
Require promise shorthand where possible

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
    "mpirik/catch-name": "error"
  }
```

## Useful links
I found these links useful while writing rules:

* http://eslint.org/docs/developer-guide/working-with-rules
* http://astexplorer.net/
