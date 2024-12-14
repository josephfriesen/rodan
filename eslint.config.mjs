import { FlatCompat } from "@eslint/eslintrc";

const [OFF, WARN, ERROR] = [0, 1, 2];

const compat = new FlatCompat({});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next",
      "next/typescript",
      "next/core-web-vitals",
      "prettier",
      "plugin:@next/next/recommended",
      "plugin:prettier/recommended",
    ],
    plugins: [],
    rules: {
      "prettier/prettier": [
        ERROR,
        {
          trailingComma: "all",
          semi: true,
          tabWidth: 2,
          singleQuote: false,
          maxWidth: 80,
        },
      ],
    },
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx"],
        plugins: ["@typescript-eslint"],
        parser: "@typescript-eslint/parser",
        parserOptions: {
          project: ["./tsconfig.json"],
        },
        rules: {
          "import/no-extraneous-dependencies": WARN,
          "no-param-reassign": ERROR,
          "consistent-return": ERROR,
          "no-console": WARN,
          "no-debugger": ERROR,
          "@typescript-eslint/naming-convention": OFF,
          "@typescript-eslint/no-explicit-any": OFF,
          "@typescript-eslint/no-empty-function": OFF,
          "@typescript-eslint/no-unused-vars": ERROR,
          "@typescript-eslint/no-var-requires": OFF,
          "react/jsx-props-no-spreading": OFF,
          "react/prop-types": OFF,
          "import/order": OFF,
        },
      },
    ],
  }),
];

export default eslintConfig;
