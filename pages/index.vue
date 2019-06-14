<template>
  <main>
    <Post v-for="post in posts" :key="post.id" :post="post" />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Post from '~/components/Post.vue'

import * as Config from 'config'
import * as WordPress from 'wordpress'
import { Context } from '@nuxt/vue-app'
import { AxiosError } from 'axios'

@Component({
  components: {
    Post
  }
})
export default class extends Vue {
  // head
  head(): Config.Head {
    return {
      titleTemplate: undefined,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: process.env.SITE_TITLE,
          template: '%s'
        }
      ]
    }
  }

  // data
  private posts!: WordPress.Post[]

  // asyncData
  async asyncData(ctx: Context): Promise<void | object> {
    const posts: WordPress.Post[] = await ctx.app.$axios
      .$get('/posts', {
        params: {
          _embed: '',
          per_page: 100
        }
      })
      .catch((err: AxiosError): void => {
        // axiosのエラーが起きたらエラーページに飛ばす
        if (err.response) {
          return ctx.error({
            statusCode: err.response.status,
            message: err.response.statusText
          })
        }
      })

    // 投稿が0件ならエラーページに飛ばす
    if (posts.length === 0) {
      return ctx.error({
        statusCode: 404,
        message: 'Not Found'
      })
    }

    console.log(posts)

    return { posts: posts }
  }
}
</script>
