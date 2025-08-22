<template>
  <header class="header">
    <h1 class="title">
      <NuxtLink to="/">{{ siteInfo.title }}</NuxtLink>
      <span
        v-if="isCategoryExists(route)"
        class="category-name"
      >
        / {{ getCategoryName(route.params.slug as string) }}
      </span>
    </h1>

    <a
      href="#"
      class="category-toggle"
      @click="toggleCategory"
    >
      <span v-if="!isCategoryActive">Category</span>
      <span v-else>[X] Category</span>
    </a>

    <nav
      v-if="data && data.allCategories.length > 0"
      class="category"
      :class="{ 'is-active': isCategoryActive }"
    >
      <ul>
        <li
          v-for="category in data.allCategories"
          :key="category.id"
        >
          <NuxtLink
            :to="`/category/${category.slug}`"
          >{{ category.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'

const route = useRoute()

// asyncData
const { data } = await useAsyncData(
  'all-categories',
  async () => {
    // すべてのカテゴリーを取得
    const categories = await useCustomFetch<WordPress.Category[]>('/categories')

    // countが0以上のカテゴリーだけを返す
    const allCategories = categories.filter((category): boolean => {
      return category.count > 0
    })

    return { allCategories }
  },
)

// data
const isCategoryActive = ref(false)

// watch
watch(() => route.path, () => {
  isCategoryActive.value = false
})

// methods
function getCategoryName(slug: string) {
  // 現在のrouteと同じカテゴリーを取得
  const currentCategory = data.value?.allCategories.filter((category) => {
    return category.slug === slug
  })[0]

  if (!currentCategory) {
    return ''
  }

  // カテゴリ名を返す
  return currentCategory.name
}

function toggleCategory(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  isCategoryActive.value = !isCategoryActive.value
}

function isCategoryExists(route: RouteLocationNormalizedLoadedGeneric): boolean {
  // route.nameがcategory-slugでない場合はfalse
  if (route.name !== 'category-slug') {
    return false
  }

  // dataが存在しない場合はfalse
  if (!data.value?.allCategories) {
    return false
  }

  // slugがallCategoriesに存在するかチェック
  return data.value.allCategories.some(category => category.slug === route.params.slug)
}
</script>

<style scoped>
.header {
  position: relative;
  margin-bottom: var(--margin-content);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  margin: 0;
  font-size: var(--fontSize-h1);

  & :any-link {
    color: inherit;
  }
}

.category-name {
  color: var(--color-caption);
}

.category-toggle {
  font-size: var(--fontSize-small);
}

.category {
  position: absolute;
  top: calc(100% + 0.2rem);
  right: 0;
  display: none;
  background-color: var(--color-accent);

  &.is-active {
    display: block;
  }

  & ul {
    margin: 0.5rem 0;
  }

  & li {
    padding: 0.5rem 1rem;
  }

  & :any-link {
    color: white;
    text-decoration-line: none;
    text-decoration-color: white;
    mix-blend-mode: exclusion;

    /* stylelint-disable-next-line csstools/media-use-custom-media */
    @media (hover) {
      &:hover {
        text-decoration-line: underline;
      }
    }
  }
}
</style>
