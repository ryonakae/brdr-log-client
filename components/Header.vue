<template>
  <header>
    <h1>
      <n-link to="/">{{ siteTitle }}</n-link>
    </h1>

    <nav v-if="categories.length > 0">
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
import { AxiosError } from 'axios'

@Component
export default class extends Vue {
  private categories: WordPress.Category[] = []

  get siteTitle(): string {
    return process.env.SITE_TITLE as string
  }

  async mounted(): Promise<void> {
    await this.$nextTick()

    console.log('header mounted')

    // すべてのカテゴリーを取得
    const categories: WordPress.Category[] = await this.$axios.$get(
      '/categories'
    )

    // countが0以上のカテゴリーだけを返す
    const filteredCategories = categories.filter((category): boolean => {
      return category.count > 0
    })

    this.categories = filteredCategories
    console.log(this.categories)
  }
}
</script>
