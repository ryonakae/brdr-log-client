<template>
  <div>
    <p>ERROR</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  mounted(): void {
    console.log('error layout mounted')
  }
}
</script>
