<template>
  <article>
    <h1>{{ post.title.rendered }}</h1>
    <div v-html="post.content.rendered" />
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import * as Config from 'config'
import * as WordPress from 'wordpress'

@Component
export default class extends Vue {
  private post!: WordPress.Post

  async asyncData(ctx: Config.MyContext): Promise<void | object> {
    // fetch previously saved static JSON payload
    if (process.static && process.client) {
      const payload = await ctx.app.$axios.get(ctx.$payloadURL(ctx.route))
      return { post: payload.data.post }
    }

    const post = await ctx.app.$axios.get(`/posts/${ctx.params.postID}`, {
      params: {
        _embed: ''
      }
    })
    // .catch((e): void => {
    //   console.log(e)
    //   ctx.error({
    //     statusCode: 404,
    //     message: 'Post Not Found'
    //   })
    // })

    const postData = post.data as WordPress.Post

    return { post: postData }
  }

  async mounted(): Promise<void> {
    await this.$nextTick()

    console.log('post mounted')
    console.log(this.$route)
    console.log(this.post)
  }
}
</script>
