module.exports = {
	env: {
    'jest/globals': true,
    'detox/detox': true,
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
    'detox',
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
    'react-native/sort-styles': 0,
    'react/prop-types': 0,
    'react-native/no-color-literals': 0,
    'react-native/no-inline-styles': 0,
    'no-inner-declarations': 0,
    'no-mixed-spaces-and-tabs': 0,
    'react-native/no-raw-text': 0,
    'react-native/no-single-element-style-arrays': 0,
    'react/no-unescaped-entities': 0,
    'react/display-name': 0,
    'jest/no-jasmine-globals': 0,
    'react/jsx-no-duplicate-props': 0
  }
}
