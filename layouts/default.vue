<template>
  <div class="app">
    <Header />
    <main class="page">
      <nuxt />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

import * as Config from 'config'

@Component({
  components: {
    Header,
    Footer
  }
})
export default class extends Vue {
  head(): Config.Head {
    return {
      htmlAttrs: {
        lang: 'ja'
      },
      title: process.env.SITE_TITLE,
      titleTemplate: `%s / ${process.env.SITE_TITLE}`,
      meta: [
        { charset: 'utf-8' },
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.SITE_DESCRIPTION
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: process.env.SITE_TITLE,
          template: `%s / ${process.env.SITE_TITLE}`
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: process.env.SITE_DESCRIPTION
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: process.env.SITE_URL
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: process.env.SITE_URL + '/ogp.png'
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:locale',
          content: 'ja_JP'
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        }
      ],
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico'
        }
      ]
    }
  }
}
</script>
