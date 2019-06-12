<template>
  <div>
    <Post v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Post from '~/components/Post.vue'

import * as Config from 'config'
import * as WordPress from 'wordpress'

@Component({
  components: {
    Post
  }
})
export default class extends Vue {
  // data
  private posts!: WordPress.Post[]

  // asyncData
  async asyncData(ctx: Config.MyContext): Promise<void | object> {
    // fetch previously saved static JSON payload
    if (process.static && process.client) {
      const payload = await ctx.app.$axios.get(ctx.$payloadURL(ctx.route))
      return { posts: payload.data.posts }
    }

    const posts = await ctx.app.$axios.get('/posts', {
      params: {
        _embed: ''
      }
    })
    const postsData = posts.data as WordPress.Post[]

    if (postsData.length === 0) {
      return ctx.error({
        statusCode: 404,
        message: 'Post Not Found'
      })
    }

    return { posts: postsData }
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
