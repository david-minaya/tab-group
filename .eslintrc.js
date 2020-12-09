module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true,
    webextensions: true
  },
  extends: [
    'standard',
    // 'plugin:@typescript-eslint/recommended',
    // 'plugin:react/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'space-before-function-paren': [
      'off'
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-unused-vars': [
      'off'
    ],
    'no-useless-constructor': [
      'off'
    ],
    'padded-blocks': [
      'off'
    ],
    'spaced-comment': [
      'off'
    ],
    'indent': [
      'warn'
    ],
    'no-trailing-spaces': [
      'off'
    ],
    'object-curly-spacing': [
      'off'
    ],
    'key-spacing': [
      'off'
    ],
    'eol-last': [
      'warn'
    ],
    'space-infix-ops': [
      'off'
    ],
    'no-multiple-empty-lines': [
      'off'
    ],
    'prefer-const': [
      'warn'
    ],
    'require-await': [
      'error'
    ],
    'quote-props': [
      'off'
    ],
    'quotes': [
      'warn'
    ],
    'no-case-declarations': 'off'
  }
}
