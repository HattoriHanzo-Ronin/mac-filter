// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
    expoConfig,
    {
        rules: {
            eqeqeq: ["warn", "always"],
            "no-var": "error",
            "prefer-const": "warn",
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
