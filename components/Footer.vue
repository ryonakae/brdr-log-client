<template>
  <footer class="footer">
    <a href="https://brdr.jp" target="_blank" rel="noopener">©Ryo Nakae</a>
    <p class="description">{{ siteDescription }}</p>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  get siteDescription(): string {
    return process.env.SITE_DESCRIPTION as string
  }
}
</script>

<style scoped>
.footer {
  display: flex;
  align-items: baseline;
  margin-top: var(--margin-content);
  font-size: var(--fontSize-small);
}

.description {
  margin: 0 0 0 auto;
  color: var(--color-caption);
}
</style>
