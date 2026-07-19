// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
    expoConfig,
    {
        rules: {
            curly: ["error", "all"],
            eqeqeq: ["warn", "always"],
            "no-else-return": "warn",
            "no-var": "error",
            "prefer-const": "warn",
            "object-shorthand": ["error", "always"],
            "no-unused-vars": "warn",
            "consistent-return": "warn",
            "arrow-body-style": ["warn", "as-needed"],
            complexity: ["warn", 10]
        }
    },
    {
        ignores: ["dist/*"]
    }
]);
