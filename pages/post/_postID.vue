<template>
  <article>
    <h1>{{ post.title.rendered }}</h1>
    <div v-html="$sanitizeHtml(post.content.rendered)" />
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Context } from '@nuxt/vue-app'
import * as WordPress from 'wordpress'

@Component
export default class extends Vue {
  private post!: WordPress.Post

  async asyncData(ctx: Context): Promise<void | object> {
    const res = await ctx.app.$axios.get(`/posts/${ctx.params.postID}`, {
      params: {
        _embed: ''
      }
    })
    return { post: res.data }
  }

  async mounted(): Promise<void> {
    await this.$nextTick()

    console.log('post mounted')
    console.log(this.$route)
    console.log(this.post)
  }
}
</script>
