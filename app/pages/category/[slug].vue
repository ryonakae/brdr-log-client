<template>
  <main v-if="data">
    <PostItem
      v-for="post in data.posts"
      :key="post.id"
      :post="post"
      class="post"
    />
  </main>
</template>

<script setup lang="ts">
const route = useRoute()

// asyncData
const { data, error } = await useAsyncData(
  `posts-${route.params.slug}`,
  async () => {
    console.log('useAsyncData:', route.params.slug)

    // すべてのカテゴリーを取得
    const categories = await useCustomFetch<WordPress.Category[]>('/categories')

    // 現在のrouteと同じカテゴリーを取得
    const filteredCategories = categories.filter((category): boolean => {
      return category.slug === route.params.slug
    })
    const category = filteredCategories[0]
    console.log('category:', category)
    console.log('filteredCategories.length:', filteredCategories.length)

    if (!category) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found',
        fatal: true,
      })
    }

    console.log('category.id:', category.id)

    // カテゴリーidをもとに投稿を取得
    const posts = await useCustomFetch<WordPress.Post[]>('/posts', {
      query: {
        _embed: '',
        categories: category.id,
        per_page: 100,
      },
    })
    console.log('posts.length:', posts.length)

    return { posts, category }
  },
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
    fatal: error.value.fatal,
  })
}

// meta
useSeoMeta({
  titleTemplate: (titleChunk) => {
    return `${siteInfo.title} / ${titleChunk}`
  },
  title: data.value?.category.name,
  description: data.value?.category.description,
})
</script>

<style scoped>
.post {
  margin-top: var(--margin-post);
  margin-bottom: var(--margin-post);

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
