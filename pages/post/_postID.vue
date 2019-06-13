<template>
  <article>
    <h1>{{ post.title.rendered }}</h1>
    <div v-html="post.content.rendered" />
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import * as WordPress from 'wordpress'
import { Context } from '@nuxt/vue-app'

@Component
export default class extends Vue {
  // data
  private post!: WordPress.Post

  // asyncData
  async asyncData(ctx: Context): Promise<void | object> {
    const post: WordPress.Post = await ctx.app.$axios.$get(
      `/posts/${ctx.params.postID}`,
      {
        params: {
          _embed: ''
        }
      }
    )
    // .catch((e): void => {
    //   console.log(e)
    //   ctx.error({
    //     statusCode: 404,
    //     message: 'Post Not Found'
    //   })
    // })

    return { post: post }
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
