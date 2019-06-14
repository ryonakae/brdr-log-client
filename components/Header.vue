<template>
  <header class="header">
    <h1 class="title">
      <n-link to="/">{{ siteTitle }}</n-link>
    </h1>

    <a href="#" class="category-toggle">Category</a>

    <nav v-if="categories.length > 0" class="category">
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
  // data
  private categories: WordPress.Category[] = []

  // computed
  get siteTitle(): string {
    return process.env.SITE_TITLE as string
  }

  // methods
  async getCategories(): Promise<void> {
    // すべてのカテゴリーを取得
    const categories: WordPress.Category[] = await this.$axios
      .$get('/categories')
      .catch((): null => {
        return null
      })

    // エラーでカテゴリーを取得できなかったらそこで処理をやめる
    if (!categories) return

    // countが0以上のカテゴリーだけを返す
    const filteredCategories = categories.filter((category): boolean => {
      return category.count > 0
    })

    this.categories = filteredCategories
  }

  // lifecycle
  async mounted(): Promise<void> {
    await this.$nextTick()
    this.getCategories()
  }
}
</script>

<style scoped>
.header {
  position: relative;
  display: flex;
  align-items: baseline;
}

.title {
  margin: 0;
  font-size: inherit;
}

.category-toggle {
  margin-left: auto;
}

.category {
  position: absolute;
  display: none;
}
</style>
