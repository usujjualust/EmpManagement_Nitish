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
      'indent': ['warn', 2],
      '@stylistic/indent': ['warn', 2],
      
      // Spacing
      'array-bracket-spacing': ['warn', 'never'],
      'object-curly-spacing': ['warn', 'always'],
      'comma-spacing': ['warn', { 'before': false, 'after': true }],
      
      // Naming conventions
      'camelcase': ['warn', { 'properties': 'never' }],
      '@typescript-eslint/naming-convention': [
        'warn',
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
      'semi': ['warn', 'always'],
      
      ...prettierRules,
    },
  
  },
  ...tseslint.configs.recommended,
];