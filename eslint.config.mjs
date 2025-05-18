// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";
// import js from "@eslint/js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
//   recommendedConfig: js.configs.recommended,
// });

// // Create base configuration
// const baseConfig = {
//   ignores: ["*.scss", "*.css", ".vscode/*", "/node_modules/*", "build/*"],
// };

// // Language configuration
// const languageConfig = {
//   languageOptions: {
//     ecmaVersion: 2022,
//     sourceType: "module",
//     parserOptions: {
//       ecmaFeatures: {
//         jsx: true,
//       },
//     },
//     globals: {
//       window: "readonly",
//       document: "readonly",
//       navigator: "readonly",
//     },
//   },
// };

// // Rules configuration
// const rulesConfig = {
//   rules: {
//     "react-hooks/rules-of-hooks": "error",
//     "react-hooks/exhaustive-deps": "warn",
//     "react/react-in-jsx-scope": "off",
//     "@typescript-eslint/explicit-module-boundary-types": "off",
//     "@typescript-eslint/no-explicit-any": "warn",
//     "react/no-unescaped-entities": "off",
//     "@typescript-eslint/no-unused-vars": "warn",
//     "no-console": "warn",
//     "react/display-name": "off",
//   },
// };

// // Create the final config array
// const eslintConfig = [
//   baseConfig,
//   languageConfig,
//   rulesConfig,
//   ...compat.extends(
//     "next/core-web-vitals",
//     "next/typescript",
//     "eslint:recommended",
//     "plugin:react/recommended",
//     "plugin:@typescript-eslint/recommended",
//     "prettier",
//     "plugin:react/jsx-runtime"
//   ),
// ];

// export default eslintConfig;

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:react/jsx-runtime"
  ),
  {
    env: {
      browser: true,
      es2021: true,
    },
    ignorePatterns: ["*.scss", "*.css", ".vscode/*", "/node_modules/*", "build/*"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: "module",
    },
    plugins: ["react", "react-hooks", "@typescript-eslint", "prettier"],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": "warn",
      "react/display-name": "off",
    },
  },
];

export default eslintConfig;


