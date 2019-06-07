import dotenv from 'dotenv'
import urljoin from 'url-join'
import * as Config from 'config'

// Using .env file in nuxt.config.js
dotenv.config()

const nuxtConfig: Config.MyNuxtConfiguration = {
  axios: {
    baseURL: urljoin(process.env.WP_SITE_URL as string, '/wp-json/wp/v2'),
    retry: { retries: 3 }
  },
  build: {
    // analyze: true,
    postcss: {
      plugins: {
        cssnano: {
          preset: 'default',
          autoprefixer: false,
          zindex: false,
          discardUnused: {
            fontFace: false
          }
        }
      },
      preset: {
        stage: 2,
        features: {
          'custom-media-queries': true,
          'nesting-rules': true
        },
        importFrom: [
          './assets/css/custom-properties.css',
          './assets/css/custom-media.css'
        ]
      }
    },
    terser: {
      parallel: true,
      sourceMap: false,
      terserOptions: {
        warnings: false,
        compress: {
          drop_console: true
        },
        output: {
          comments: /@license/i
        }
      }
    }
  },
  css: ['~/assets/css/common.css'],
  env: {
    SITE_TITLE: 'LOG',
    SITE_URL: 'https://log.brdr.jp',
    SITE_DESCRIPTION: 'Logs by Ryo Nakae',
    WP_SITE_URL: process.env.WP_SITE_URL as string
  },
  loading: false,
  modules: ['@nuxtjs/axios', '@nuxtjs/dotenv'],
  plugins: [{ src: '~/plugins/sanitizeHtml', mode: 'all' }]
}

export default nuxtConfig
