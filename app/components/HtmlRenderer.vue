<template>
  <component :is="renderedContent" />
</template>

<script setup lang="ts">
const props = defineProps<{
  html: string
}>()

const { renderedContent } = useHtml(props.html)
</script>
