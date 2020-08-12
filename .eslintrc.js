module.exports = {
	env: {
    "jest/globals": true,
    'react-native/react-native': true
	},
	extends: [
		'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:jest/recommended',
    'plugin:jest/style'
	],
	parserOptions: {
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 11,
		'sourceType': 'module'
	},
	plugins: [
    'jest',
    'react',
    'react-native'
  ],
  settings: {
    react: {
      version: 'detect',
    },
    jest: {
      version: 26
    }
  },
  rules: {
    "react-native/no-unused-styles": 0,
    'react-native/sort-styles': 0
  }
}
