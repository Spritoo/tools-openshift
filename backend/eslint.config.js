import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default [
    {
        languageOptions: {
            globals: globals.node,
        },
    },
    pluginJs.configs.recommended,
    {
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            // Enables Prettier rules as ESLint rules
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                },
            ],
            'no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
    configPrettier, // Disables rules that conflict with Prettier
]
