<template>
  <article>
    <h2 class="title">
      <NuxtLink :to="`/post/${post.id}`">
        {{ post.title.rendered }}
      </NuxtLink>
    </h2>
    <PostInfo
      class="info"
      :categories="post._categories"
      :date="post.date"
    />
  </article>
</template>

<script setup lang="ts">
defineProps<{
  post: WordPress.Post
}>()
</script>

<style scoped>
.title {
  margin: 0;
  font-size: var(--fontSize-h3);

  & :any-link {
    color: inherit;
  }
}

.info {
  margin-top: 0.5rem;
}
</style>
