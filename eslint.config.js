import globals from 'globals';
// import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pkg from 'eslint-config-prettier';
import stylistic from '@stylistic/eslint-plugin'

const { rules: prettierRules } = pkg;

export default [
  {
    files: ['**/*.ts}'],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // Adjust this path if needed
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@stylistic': stylistic,
    },
    rules: {
      // Indentation
      'indent': ['error', 2],
      '@stylistic/indent': ['error', 2],
      
      // Spacing
      'array-bracket-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      
      // Naming conventions
      'camelcase': ['error', { 'properties': 'never' }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          'selector': 'variable',
          'format': ['camelCase', 'UPPER_CASE']
        },
        {
          'selector': 'function',
          'format': ['camelCase']
        },
        {
          'selector': 'typeLike',
          'format': ['PascalCase']
        }
      ],
      
      // Other rules
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'warn',
      'semi': ['error', 'always'],
      
      ...prettierRules,
    },
  
  },
  ...tseslint.configs.recommended,
];