import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        files: ["**/*.{js,mjs,jsx,ts,tsx}"],
        ignores: ["./dist", "node_modules", "tsconfig.json"],
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "no-console": "warn",
            "@typescript-eslint/no-magic-numbers": ["warn", {
                ignoreEnums: true,
                ignoreReadonlyClassProperties: true,
            }],
            "@typescript-eslint/no-use-before-define": "error",
            "@typescript-eslint/no-empty-interface": "warn",
            "prefer-const": "warn",
        },
    },
);