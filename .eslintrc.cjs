module.exports = {
    root: true,
    env: { browser: true, es2021: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'standard-with-typescript',
        'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', 'react', 'react-hooks', 'eslint-plugin-tsdoc'],
    rules: {
        'no-debugger': 'off',
        'no-shadow': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'import/prefer-default-export': 'off',
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        '@typescript-eslint/indent': ['error', 4],
        'no-multiple-empty-lines': [
            'error',
            {
                max: 3,
                maxEOF: 0,
                maxBOF: 0,
            },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        semi: [1, 'always'],
        'max-len': [
            'error',
            {
                code: 150,
                ignoreUrls: true,
                ignoreTemplateLiterals: true,
                ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
            },
        ],
        'arrow-body-style': ['error', 'always'],
        'tsdoc/syntax': 'warn',
        '@typescript-eslint/consistent-indexed-object-style': 'off',
        '@typescript-eslint/strict-boolean-expressions': [
            'off',
            {
                allowNullableObject: true,
                allowString: true,
                allowNumber: true,
            },
        ],
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-shadow': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    },
};
