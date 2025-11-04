import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import parser from "@typescript-eslint/parser";
import plugin from "@typescript-eslint/eslint-plugin";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,mjs,cjs}"],
    languageOptions: {
      parser,
      sourceType: "module",
      globals: globals.node,
    },
    plugins: { "@typescript-eslint": plugin },
    rules: {
      ...plugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
          "warn",
          {
              argsIgnorePattern: "^(req|res|next|_)$",
              varsIgnorePattern: "^_",
              caughtErrorsIgnorePattern: "^_",
          },
      ],

      "@typescript-eslint/no-explicit-any": "off",

      "no-undef": "warn",
    },
    extends: [prettierConfig],
  },
]);

