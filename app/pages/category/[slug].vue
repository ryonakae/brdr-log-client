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

const { data } = await useAsyncData(
  `posts-${route.params.slug}`,
  async () => {
    // すべてのカテゴリーを取得
    const categoriesRes = await useCustomFetch<WordPress.Category[]>('/categories')
    const categories = categoriesRes.data.value

    if (!categories) return

    // 現在のrouteと同じカテゴリーを取得
    const filteredCategories = categories.filter((category): boolean => {
      return category.slug === route.params.slug
    })
    const category = filteredCategories[0]

    if (!category) return

    // カテゴリーidをもとに投稿を取得
    const postsRes = await useCustomFetch<WordPress.Post[]>('/posts', {
      query: {
        _embed: '',
        categories: category.id,
        per_page: 100,
      },
    })
    const posts = postsRes.data.value

    return { posts, category }
  },
)
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
