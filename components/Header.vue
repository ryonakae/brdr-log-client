<template>
  <header class="header">
    <h1 class="title">
      <n-link to="/">{{ siteTitle }}</n-link>
    </h1>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  get siteTitle(): string {
    return process.env.SITE_TITLE as string
  }

  mounted(): void {
    console.log('header mounted')
  }
}
</script>
