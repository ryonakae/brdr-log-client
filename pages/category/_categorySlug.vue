<template>
  <div>
    <Post v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Post from '~/components/Post.vue'
import { Context } from '@nuxt/vue-app'
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
  async asyncData(ctx: Context): Promise<void | object> {
    // カテゴリーslugからidを取得
    const categories = await ctx.app.$axios.get('/categories')
    const categoriesData = categories.data as WordPress.Category[]
    const filteredCategories = categoriesData.filter((category): boolean => {
      return category.slug === ctx.route.params.categorySlug
    })
    const categoryID = filteredCategories[0].id

    const posts = await ctx.app.$axios.get('/posts', {
      params: {
        _embed: '',
        categories: categoryID
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

    console.log('category page mounted')
    console.log(this.$route.params)
    console.log(this.posts)
  }
}
</script>
