module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-unused-vars': 'off', // Turn off base rule as it can report incorrect errors
    'no-undef': 'off', // TypeScript handles this
  },
  env: {
    node: true,
    es6: true,
  },
  globals: {
    Express: 'readonly',
  },
};
