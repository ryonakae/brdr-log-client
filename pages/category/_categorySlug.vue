<template>
  <div>
    <Post v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Post from '~/components/Post.vue'

import * as WordPress from 'wordpress'
import { Context } from '@nuxt/vue-app'
import { AxiosError } from 'axios'

@Component({
  components: {
    Post
  }
})
export default class extends Vue {
  // data
  private posts!: WordPress.Post[]

  // asyncData
  async asyncData(ctx: Context): Promise<void | object> {
    // カテゴリーslugからidを取得
    const categories: WordPress.Category[] = await ctx.app.$axios.$get(
      '/categories'
    )

    const filteredCategories = categories.filter((category): boolean => {
      return category.slug === ctx.route.params.categorySlug
    })
    const categoryID = filteredCategories[0].id

    // カテゴリーidをもとに投稿を取得
    const posts: WordPress.Post[] = await ctx.app.$axios
      .$get('/posts', {
        params: {
          _embed: '',
          categories: categoryID,
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
        message: 'Post Not Found'
      })
    }
    return { posts: posts }
  }

  // lifecycle
  async mounted(): Promise<void> {
    await this.$nextTick()

    console.log('category page mounted')
    console.log(this.$route.params)
    console.log(this.posts)
  }
}
</script>
