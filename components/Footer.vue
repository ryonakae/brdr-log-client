<template>
  <footer class="footer">
    <p>{{ siteDescription }}</p>
    <small class="copyright">©Ryo Nakae</small>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  get siteDescription(): string {
    return process.env.SITE_DESCRIPTION as string
  }

  mounted(): void {
    console.log('footer mounted')
  }
}
</script>
