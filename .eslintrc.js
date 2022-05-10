module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    rules: {
		'vue/no-unused-components': 0,
		'no-unused-vars': 0,
        'no-console': 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-mixed-spaces-and-tabs': 0,
        'no-useless-escape': 0
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
