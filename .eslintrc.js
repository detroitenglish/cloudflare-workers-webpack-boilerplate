module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 9,
    sourceType: `module`,
    allowImportExportEverywhere: true,
    requireConfigFile: false,
  },
  env: {
    node: true,
    es6: true,
  },
  parser: `@babel/eslint-parser`,
  extends: [`eslint:recommended`, `plugin:prettier/recommended`],
  rules: {
    'babel/no-invalid-this': 0,
    'babel/no-unused-expressions': 0,
    'babel/valid-typeof': 0,
    'no-console': 0,
    'no-empty': `off`,
    'no-var': `error`,
    'prefer-template': `error`,
    quotes: [`warn`, `backtick`],
    eqeqeq: `error`,
    strict: `error`,
    'require-await': `error`,
    'prettier/prettier': [
      `warn`,
      {},
      {
        usePrettierrc: true,
      },
    ],
  },
}
