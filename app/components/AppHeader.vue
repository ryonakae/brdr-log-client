<template>
  <header class="header">
    <h1 class="title">
      <NuxtLink to="/">{{ siteInfo.title }}</NuxtLink>
      <span
        v-if="$route.name === 'category-slug' && currentCategoryName"
        class="category-name"
      >
        / {{ currentCategoryName }}</span>
    </h1>

    <a
      href="#"
      class="category-toggle"
      @click="toggleCategory"
    >
      <span v-if="!isCategoryActive">Category</span>
      <span v-else>Close</span>
    </a>

    <nav
      v-if="currentCategories && currentCategories.length > 0"
      class="category"
      :class="{ 'is-active': isCategoryActive }"
    >
      <ul>
        <li
          v-for="category in currentCategories"
          :key="category.id"
        >
          <NuxtLink
            :to="`/category/${category.slug}`"
            @click="setCurrentCategoryName(category.name)"
          >{{ category.name }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'

const route = useRoute()

// state
// const currentCategories = ref<WordPress.Category[]>([])
const currentCategory = ref<WordPress.Category | null>(null)
const currentCategoryName = ref('')
const isCategoryActive = ref(false)

const { data: currentCategories } = await useAsyncData(
  'current-categories',
  async () => {
  // すべてのカテゴリーを取得
    const res = await useCustomFetch<WordPress.Category[]>('/categories')
    const categories = res.data.value

    // エラーでカテゴリーを取得できなかったらそこで処理をやめる
    if (!categories) return

    // countが0以上のカテゴリーだけを返す
    const filteredCategories = categories.filter((category): boolean => {
      return category.count > 0
    })

    return filteredCategories
  },
  {
    server: true,
    default: () => [],
  },
)

// watch
watch(() => route, (newRoute) => {
  if (newRoute.name === 'category-slug') {
    const _currentCategory = getCurrentCategory(newRoute)

    if (_currentCategory) {
      currentCategory.value = _currentCategory
      setCurrentCategoryName(_currentCategory.name)
    }
  }
  else {
    isCategoryActive.value = false
    currentCategory.value = null
    currentCategoryName.value = ''
  }
})

// methods
function getCurrentCategory(route: RouteLocationNormalizedLoadedGeneric) {
  if (!currentCategories.value) {
    return null
  }

  // 現在のrouteと同じカテゴリーを抽出
  const filteredCategories = currentCategories.value.filter((category): boolean => {
    return category.slug === route.params.categorySlug
  })
  if (!filteredCategories) {
    return null
  }

  return filteredCategories[0]
}

function setCurrentCategoryName(categoryName: string) {
  console.log('setCurrentCategoryName:', categoryName)
  isCategoryActive.value = false
  currentCategoryName.value = categoryName
}

function toggleCategory(e: MouseEvent | TouchEvent) {
  e.preventDefault()
  isCategoryActive.value = !isCategoryActive.value
}

// lifecycle
onMounted(async () => {
  await nextTick()

  if (route.name === 'category-slug') {
    const _currentCategory = getCurrentCategory(route)

    if (_currentCategory) {
      setCurrentCategoryName(_currentCategory.name)
    }
  }
})
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
