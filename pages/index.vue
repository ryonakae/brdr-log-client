<template>
  <div>
    <article v-for="post in posts" :key="post.id">
      <n-link :to="`/post/${post.id}`">
        <h1>{{ post.title.rendered }}</h1>
        <div>{{ getDate(post.date) }}</div>
      </n-link>
    </article>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { Context } from '@nuxt/vue-app'
import * as WordPress from 'wordpress'

@Component
export default class extends Vue {
  // data
  private posts!: WordPress.Post[]

  // asyncData
  async asyncData(ctx: Context): Promise<void | object> {
    const res = await ctx.app.$axios.get('/posts', {
      params: {
        _embed: ''
      }
    })
    return { posts: res.data }
  }

  // methods
  getDate(date: string): string {
    return dayjs(date).format('YYYY/M/D')
  }

  // lifecycle
  async mounted(): Promise<void> {
    await this.$nextTick()

    console.log('index mounted')
    console.log(process.env.WP_SITE_URL)
    console.log(this.posts)
  }
}
</script>
