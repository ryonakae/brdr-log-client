<template>
  <article>
    <figure v-if="post._embedded['wp:featuredmedia']">
      <img
        :src="
          post._embedded['wp:featuredmedia'][0].media_details.sizes.medium
            .source_url
        "
        :alt="post.title.rendered"
      />
    </figure>
    <h1>
      <a :href="`/post/${post.id}`">{{ post.title.rendered }}</a>
    </h1>
    <div>{{ getDate(post.date) }}</div>
    <div v-for="category in post._categories" :key="category.term_id">
      <n-link :to="`/category/${category.slug}`">{{ category.name }}</n-link>
    </div>
    <div v-html="post.content.rendered" />
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'

import * as Config from 'config'
import * as WordPress from 'wordpress'
import { Context } from '@nuxt/vue-app'
import { AxiosError } from 'axios'

@Component
export default class extends Vue {
  // head
  head(): Config.Head {
    return {
      title: this.post.title.rendered,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.post._excerpt
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.post.title.rendered
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.post._excerpt
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: process.env.SITE_URL + this.$route.path
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.ogImage
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'article'
        }
      ]
    }
  }

  // data
  private post!: WordPress.Post

  // asyncData
  async asyncData(ctx: Context): Promise<void | object> {
    const post: WordPress.Post = await ctx.app.$axios
      .$get(`/posts/${ctx.params.postID}`, {
        params: {
          _embed: ''
        }
      })
      .catch((err: AxiosError): void => {
        if (err.response) {
          return ctx.error({
            statusCode: err.response.status,
            message: err.response.statusText
          })
        }
      })

    return { post: post }
  }

  // computed
  get ogImage(): string {
    let ogImage: string

    if (this.post._embedded['wp:featuredmedia']) {
      ogImage = this.post._embedded['wp:featuredmedia'][0].media_details.sizes
        .medium.source_url
    } else {
      ogImage = process.env.SITE_URL + '/ogp.png'
    }

    return ogImage
  }

  // methods
  getDate(date: string): string {
    return dayjs(date).format('YYYY/M/D')
  }

  // lifecycle
  async mounted(): Promise<void> {
    await this.$nextTick()

    console.log('post mounted')
    console.log(this.$route)
    console.log(this.post)
  }
}
</script>
