import dotenv from 'dotenv'
import urljoin from 'url-join'
import axios from 'axios'

import * as Config from 'config'
import * as WordPress from 'wordpress'
import { NuxtConfigurationGenerateRoute } from '@nuxt/config/types/generate'
import '@nuxtjs/axios'

// Using .env file in nuxt.config.js
dotenv.config()

const nuxtConfig: Config.MyNuxtConfiguration = {
  axios: {
    baseURL: urljoin(process.env.WP_SITE_URL as string, '/wp-json/wp/v2')
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
    }
    // terser: {
    //   parallel: true,
    //   sourceMap: false,
    //   terserOptions: {
    //     warnings: false,
    //     compress: {
    //       drop_console: true
    //     },
    //     output: {
    //       comments: /@license/i
    //     }
    //   }
    // }
  },
  css: ['~/assets/css/common.css'],
  env: {
    SITE_TITLE: 'LOG',
    SITE_URL: 'https://log.brdr.jp',
    SITE_DESCRIPTION: 'Logs by Ryo Nakae',
    WP_SITE_URL: process.env.WP_SITE_URL as string
  },
  generate: {
    fallback: true,
    routes: async (): Promise<NuxtConfigurationGenerateRoute[]> => {
      // get index routes
      async function getIndexRoute(): Promise<
        NuxtConfigurationGenerateRoute[]
      > {
        const posts = await axios.get(
          urljoin(process.env.WP_SITE_URL as string, '/wp-json/wp/v2/posts'),
          {
            params: {
              _embed: ''
            }
          }
        )
        const postsData = posts.data as WordPress.Post[]
        return postsData.map(
          (post): NuxtConfigurationGenerateRoute => {
            return {
              route: `/post/${post.id}`,
              payload: post
            }
          }
        )
      }

      // get category page routes
      async function getCategoryRoute(): Promise<
        NuxtConfigurationGenerateRoute[]
      > {
        // すべてのカテゴリーを取得
        const categories = await axios.get(
          urljoin(
            process.env.WP_SITE_URL as string,
            '/wp-json/wp/v2/categories'
          )
        )
        const categoriesData = categories.data as WordPress.Category[]

        // countが0以上のカテゴリーだけを返す
        const filteredCategories = categoriesData.filter(
          (category): boolean => {
            return category.count > 0
          }
        )

        return filteredCategories.map(
          (category): NuxtConfigurationGenerateRoute => {
            return {
              route: `/category/${category.slug}`,
              payload: category
            }
          }
        )
      }

      const routes = await Promise.all([getIndexRoute(), getCategoryRoute()])
      return [...routes[0], ...routes[1]]
    }
  },
  loading: false,
  mode: 'universal',
  modules: ['@nuxtjs/axios', '@nuxtjs/dotenv', 'nuxt-payload-extractor']
}

export default nuxtConfig
