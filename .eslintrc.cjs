module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      files: ['./dist/cjs/*.js'],
      extends: ['eslint:recommended', 'prettier'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'commonjs',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
