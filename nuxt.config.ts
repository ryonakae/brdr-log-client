import dotenv from 'dotenv'
import urljoin from 'url-join'
import axios from 'axios'
import * as Config from 'config'
import * as WordPress from 'wordpress'
import { NuxtConfigurationGenerateRoute } from '@nuxt/types/config/generate'
import Feed from './modules/feed'
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
  buildModules: ['@nuxt/typescript-build'],
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
      // create feed
      const feed = new Feed({
        title: 'LOG',
        id: 'https://log.brdr.jp',
        link: 'https://log.brdr.jp',
        description: 'Logs by Ryo Nakae',
        copyright: '©Ryo Nakae'
      })

      // get index routes
      async function getPostsRoute(): Promise<
        NuxtConfigurationGenerateRoute[]
      > {
        const posts = await axios.get(
          urljoin(process.env.WP_SITE_URL as string, '/wp-json/wp/v2/posts'),
          {
            params: {
              _embed: '',
              per_page: 100
            }
          }
        )
        const postsData = posts.data as WordPress.Post[]
        return postsData.map(
          (post): NuxtConfigurationGenerateRoute => {
            // Feedにエントリーを追加
            feed.addItem(post)

            return {
              route: `/post/${post.id}`,
              payload: post
            }
          }
        )
      }

      // get category page routes
      async function getCategoryIndexRoute(): Promise<
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

      const routes = await Promise.all([
        getPostsRoute(),
        getCategoryIndexRoute()
      ])

      // generate feed
      await feed.generate('./dist/feed.xml')

      return [...routes[0], ...routes[1]]
    }
  },
  loading: false,
  mode: 'universal',
  modules: ['@nuxtjs/axios', '@nuxtjs/dotenv']
}

export default nuxtConfig
