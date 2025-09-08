module.exports = {
  root: true,
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    '**/.eslintrc.js',
  ],
  overrides: [
    {
      files: ['frontend/**/*.{ts,tsx,js,jsx}'],
      extends: ['./frontend/.eslintrc.json'],
    },
    {
      files: ['backend/**/*.{ts,js}'],
      extends: ['./backend/.eslintrc.js'],
    },
  ],
};
