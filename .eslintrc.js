/* eslint-env node */

const dev = !process.env.WORKER_ACTION

const config = {
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 9,
    parser: 'babel-eslint',
  },
  rules: {
    'no-undef': 'error',
  },
}

if (dev) {
  config.plugins = ['babel', 'prettier']
  config.extends = ['eslint:recommended', 'plugin:prettier/recommended']
  config.parserOptions.sourceType = 'module'
  config.rules = {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'require-await': 'error',
  }
}

module.exports = config
