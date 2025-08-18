// https://nuxt.com/docs/api/configuration/nuxt-config

const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  ssr: true,
  devtools: { enabled: true },
  css: [
    'sanitize.css',
    '~/assets/styles/font-face-common.css',
    '~/assets/styles/font-face-kinto-regular.css',
    '~/assets/styles/font-face-kinto-bold.css',
    '~/assets/styles/custom-properties.css',
    '~/assets/styles/main.css',
  ],
  runtimeConfig: {
    public: {
      wpSiteUrl: '',
    },
  },
  compatibilityDate: '2025-08-18',
  nitro: {
    minify: isProduction,
    sourceMap: !isProduction,
  },
  vite: {
    build: {
      minify: isProduction ? 'terser' : false,
      terserOptions: {
        sourceMap: !isProduction,
        compress: {
          drop_console: true,
        },
        format: {
          comments: /@license/i,
        },
      },
    },
  },
  typescript: {
    typeCheck: true,
  },
  postcss: {
    plugins: {
      '@csstools/postcss-global-data': {
        files: [
          './app/assets/styles/custom-media.css',
        ],
      },
      'postcss-preset-env': {
        stage: 2,
        features: {
          'custom-media-queries': true,
          'nesting-rules': true,
        },
      },
      'cssnano': isProduction
        ? { preset: 'default' }
        : undefined,
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
