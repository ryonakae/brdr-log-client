<template>
  <footer class="footer">
    <p class="description">{{ siteDescription }}</p>
    <a class="copyright" href="https://brdr.jp" target="_blank" rel="noopener"
      >©Ryo Nakae</a
    >
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
  font-size: var(--fontSize-small);
  font-weight: bold;
  color: var(--color-caption);
}

.description {
  margin: 0;
}

.copyright {
  margin-left: auto;
}
</style>
