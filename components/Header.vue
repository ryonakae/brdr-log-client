<template>
  <header class="header">
    <h1 class="title">
      <n-link to="/">{{ siteTitle }}</n-link>
      <span
        v-if="$route.name === 'category-categorySlug' && currentCategoryName"
        class="category-name"
      >
        / {{ currentCategoryName }}</span
      >
    </h1>

    <a href="#" class="category-toggle" @click="toggleCategory">
      <span>Category</span>
    </a>

    <nav
      v-if="categories.length > 0"
      class="category"
      :class="{ 'is-active': isCategoryActive }"
    >
      <ul>
        <li v-for="category in categories" :key="category.id">
          <n-link
            :to="`/category/${category.slug}`"
            @click.native="setCurrentCategoryName(category.name)"
            >{{ category.name }}</n-link
          >
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import * as WordPress from 'wordpress'
import { Route } from 'vue-router'

@Component
export default class extends Vue {
  // data
  private categories: WordPress.Category[] = []
  private currentCategory: WordPress.Category | null = null
  private currentCategoryName = ''
  private isCategoryActive = false

  // computed
  get siteTitle(): string {
    return process.env.SITE_TITLE as string
  }

  // watch
  @Watch('$route')
  onRouteChange(to: Route): void {
    if (to.name === 'category-categorySlug') {
      this.currentCategory = this.getCurrentCategory()
      this.setCurrentCategoryName(this.currentCategory.name)
    } else {
      this.isCategoryActive = false
      this.currentCategory = null
      this.currentCategoryName = ''
    }
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

  getCurrentCategory(): WordPress.Category {
    // 現在のrouteと同じカテゴリーを抽出
    const filteredCategories = this.categories.filter((category): boolean => {
      return category.slug === this.$route.params.categorySlug
    })
    return filteredCategories[0]
  }

  toggleCategory(e: MouseEvent | TouchEvent): void {
    e.preventDefault()
    this.isCategoryActive = !this.isCategoryActive
  }

  setCurrentCategoryName(categoryName: string): void {
    this.isCategoryActive = false
    this.currentCategoryName = categoryName
  }

  // lifecycle
  async mounted(): Promise<void> {
    await this.$nextTick()
    await this.getCategories()

    if (this.$route.name === 'category-categorySlug') {
      this.currentCategory = this.getCurrentCategory()
      this.setCurrentCategoryName(this.currentCategory.name)
    }
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

.category-name {
  font-weight: normal;
}

.category-toggle {
  margin-left: auto;
}

.category {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  display: none;
  background-color: var(--color-bg);
  border: 1px solid var(--color-imageBg);

  &.is-active {
    display: block;
  }

  & ul {
    margin: calc(var(--margin-site) * 0.6) 0;
  }

  & li {
    padding: calc(var(--margin-site) * 0.2) var(--margin-site);
  }
}
</style>
