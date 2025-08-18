<template>
  <header class="header">
    <h1 class="title">
      <NuxtLink to="/">{{ siteInfo.title }}</NuxtLink>
      <span
        v-if="route.name === 'category-slug'"
        class="category-name"
      >
        / {{ getCategoryName(route.params.slug as string) }}</span>
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
      v-if="allCategories && allCategories.length > 0"
      class="category"
      :class="{ 'is-active': isCategoryActive }"
    >
      <ul>
        <li
          v-for="category in allCategories"
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
const route = useRoute()

// asyncData
const { data: allCategories } = await useAsyncData(
  'all-categories',
  async () => {
    // すべてのカテゴリーを取得
    const categories = await useCustomFetch<WordPress.Category[]>('/categories')

    // countが0以上のカテゴリーだけを返す
    const filteredCategories = categories.filter((category): boolean => {
      return category.count > 0
    })

    return filteredCategories
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
  if (!allCategories.value) {
    return ''
  }

  // 現在のrouteと同じカテゴリーを取得
  const currentCategory = allCategories.value.filter((category) => {
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
