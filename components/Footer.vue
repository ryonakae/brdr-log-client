<template>
  <footer class="footer">
    <small class="copyright">©Ryo Nakae</small>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  mounted(): void {
    console.log('footer mounted')
  }
}
</script>
