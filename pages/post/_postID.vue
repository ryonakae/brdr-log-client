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

import * as WordPress from 'wordpress'
import { Context } from '@nuxt/vue-app'
import { AxiosError } from 'axios'

@Component
export default class extends Vue {
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
