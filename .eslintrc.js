module.exports = {
  root: true,
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
    'prettier/standard',
    'prettier/vue',
    'prettier/@typescript-eslint'
  ],
  rules: {
    camelcase: 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/camelcase': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'unicorn/number-literal-case': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/no-v-html': 'warn',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always'
        }
      }
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        ignores: ['nuxt', 'nuxt-link', 'n-link', 'transition', 'no-ssr']
      }
    ]
  }
}
