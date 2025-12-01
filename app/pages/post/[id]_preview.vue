<template>
  <PostContent
    v-if="data"
    :post="data.post"
    is-preview
  />
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const { data, error } = await useAsyncData(
  `post-preview-${route.params.id}`,
  async () => {
    const post = await useCustomFetch<WordPress.Post>(`/posts/${route.params.id}`, {
      headers: {
        Authorization: `Basic ${config.wpAuthKey}`,
      },
      query: {
        _embed: '',
        status: 'draft',
      },
      cache: 'no-cache',
    })

    return { post }
  },
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
    fatal: error.value.fatal,
  })
}
</script>
