/* eslint-env node */

module.exports = {
  env: {
    es6: true,
  },
  parser: 'babel-eslint',
  plugins: ['prettier', 'babel'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 9,
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'require-await': 'error',
  },
}
