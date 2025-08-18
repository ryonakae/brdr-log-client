<template>
  <div class="app">
    <AppHeader />
    <main>
      <h1>{{ props.error.statusCode }}</h1>
      <p>{{ props.error.statusMessage }}</p>
      <NuxtLink to="/">Back to Index</NuxtLink>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()
</script>

<style scoped>
.app {
  max-width: calc(var(--max-width-site) + var(--margin-site) * 2);
  padding: var(--margin-content) var(--margin-site);
  margin: 0 auto;
}
</style>
