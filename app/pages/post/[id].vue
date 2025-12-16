<template>
  <PostContent
    v-if="data"
    :post="data.post"
    :is-preview="isPreview"
  />
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const isPreview = computed(() => route.query.preview === 'true')

const { data, error } = await useAsyncData(
  `post-${route.params.id}${isPreview.value ? '-preview' : ''}`,
  async () => {
    const fetchOptions: Parameters<typeof useCustomFetch>[1] = {
      query: {
        _embed: '',
      },
    }

    if (isPreview.value) {
      fetchOptions.headers = {
        Authorization: `Basic ${config.public.wpAuthKey}`,
      }
      fetchOptions.query!.status = 'draft'
      fetchOptions.cache = 'no-cache'
    }

    const post = await useCustomFetch<WordPress.Post>(
      `/posts/${route.params.id}`,
      fetchOptions,
    )

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
