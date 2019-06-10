<template>
  <header>
    <h1>
      <n-link to="/">{{ siteTitle }}</n-link>
    </h1>

    <nav>
      <ul>
        <li v-for="category in categories" :key="category.id">
          <n-link :to="`/category/${category.slug}`">{{
            category.name
          }}</n-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as WordPress from 'wordpress'

@Component
export default class extends Vue {
  private categories: WordPress.Category[] = []

  get siteTitle(): string {
    return process.env.SITE_TITLE as string
  }

  async mounted(): Promise<void> {
    console.log('header mounted')
    console.log(this.categories)

    // すべてのカテゴリーを取得
    const categories = await this.$axios.get('/categories')
    const categoriesData = categories.data as WordPress.Category[]

    // countが0以上のカテゴリーだけを返す
    const filteredCategories = categoriesData.filter((category): boolean => {
      return category.count > 0
    })

    this.categories = filteredCategories
    console.log(this.categories)
  }
}
</script>
