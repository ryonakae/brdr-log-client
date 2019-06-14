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
      title: this.catetgory.name,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.catetgory.description
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.catetgory.name
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: process.env.SITE_URL + this.$route.path
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.catetgory.description
        }
      ]
    }
  }

  // data
  private posts!: WordPress.Post[]
  private catetgory!: WordPress.Category

  // asyncData
  async asyncData(ctx: Context): Promise<void | object> {
    // カテゴリーslugからidを取得
    const categories: WordPress.Category[] = await ctx.app.$axios
      .$get('/categories')
      .catch((): null => {
        return null
      })

    // エラーでカテゴリーを取得できなかったらエラーページに遷移
    // 雑に503を返す
    if (!categories) {
      return ctx.error({
        statusCode: 503,
        message: 'Service Temporarily Unavailable'
      })
    }

    // 現在のrouteと同じカテゴリーを抽出
    const filteredCategories = categories.filter((category): boolean => {
      return category.slug === ctx.route.params.categorySlug
    })
    const catetgory = filteredCategories[0]
    console.log(catetgory)

    // カテゴリーidをもとに投稿を取得
    const posts: WordPress.Post[] = await ctx.app.$axios
      .$get('/posts', {
        params: {
          _embed: '',
          categories: catetgory.id,
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

    return {
      posts: posts,
      catetgory: catetgory
    }
  }
}
</script>
