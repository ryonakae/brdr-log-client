<template>
  <main v-if="data">
    <NuxtLink to="/category/hoo">hoo</NuxtLink>

    <PostItem
      v-for="post in data.posts"
      :key="post.id"
      :post="post"
      class="post"
    />
  </main>
</template>

<script setup lang="ts">
const { data } = await useAsyncData(
  'posts-all',
  async () => {
    const posts = await useCustomFetch<WordPress.Post[]>('/posts', {
      query: {
        _embed: '',
        per_page: 100,
      },
    })

    return { posts }
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
