<template>
  <main>
    <PostItem
      v-for="post in posts"
      :key="post.id"
      :post="post"
      class="post"
    />
  </main>
</template>

<script setup lang="ts">
const { data: posts } = await useAsyncData(
  'posts-all',
  async () => {
    const res = await useCustomFetch<WordPress.Post[]>('/posts', {
      query: {
        _embed: '',
        per_page: 100,
      },
    })
    const posts = res.data.value
    // console.log(posts)

    return posts
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
