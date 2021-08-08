module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: ['@typescript-eslint', 'no-loops'],
  extends: [
    'airbnb',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'import/prefer-default-export': 'off',
  },
  overrides: [
    {
      files: ['src/**/*.js', 'e2e/**/*.js'],
      rules: {
        //     '@typescript-eslint/no-floating-promises': 'off',
        //     '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        //     '@typescript-eslint/naming-convention': 'off',
        //     '@typescript-eslint/no-unsafe-assignment': 'off',
        //     '@typescript-eslint/no-unsafe-call': 'off',
        //     '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        //     '@typescript-eslint/no-unused-vars': 'off',
        //     '@typescript-eslint/require-await': 'off',
        //     '@typescript-eslint/restrict-template-expressions': 'off',
        //     'object-curly-newline': 'off',
        //     'implicit-arrow-linebreak': 'off',
      },
    },
    {
      files: ['bin/**/*.ts'],
      rules: {
        'import/no-unresolved': 'warn',
        'import/extensions': 'warn',
      },
    },
    {
      files: ['bin/**/*.ts', 'lib/**/*.ts'],
      rules: {
        'no-new': 'warn',
        'import/no-cycle': 'warn',
        'no-unused-vars': 'warn',
      },
    },
  ],
};
