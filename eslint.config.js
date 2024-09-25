import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { rules } from "eslint-config-prettier";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.Parser, // Ensure to use the TypeScript parser
    },
    rules: {
      // Custom rules
      "no-explicit-any": false,
      // Other custom rules can go here
      ...rules, // Include rules from eslint-config-prettier
    },
  },
  // Recommended configurations
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
