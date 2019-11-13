module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard'
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
    ]
  }
}
