import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.config.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
      sourceType: "module",
    },
    extends: [js.configs.recommended, prettierConfig],
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "req|res" }],
      "no-undef": "warn",
    },
  },
]);
