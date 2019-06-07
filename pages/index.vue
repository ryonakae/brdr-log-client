<template>
  <h1>Index</h1>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/vue-app'
import * as WordPress from 'wordpress'

@Component
export default class extends Vue {
  async asyncData(ctx: Context) {
    const res = await ctx.app.$axios.get(
      process.env.WP_SITE_URL + '/wp-json/wp/v2/posts',
      {
        params: {
          _embed: ''
        }
      }
    )
    const posts = res.data as WordPress.Post[]
    console.log(posts)
  }

  async mounted(): Promise<void> {
    await this.$nextTick()
    console.log('index mounted')
    console.log(process.env.WP_SITE_URL)
  }
}
</script>
