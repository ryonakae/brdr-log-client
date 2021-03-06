<template>
  <main>
    <Post v-for="post in posts" :key="post.id" :post="post" class="post" />
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as Config from 'config'
import * as WordPress from 'wordpress'
import { Context } from '@nuxt/types'
import { AxiosError } from 'axios'
import Post from '~/components/Post.vue'

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
    if (!posts || posts.length === 0) {
      return ctx.error({
        statusCode: 404,
        message: 'Not Found'
      })
    }

    console.log(posts)

    return { posts }
  }
}
</script>

<style scoped>
.post {
  margin-top: var(--margin-post);
  margin-bottom: var(--margin-post);

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
