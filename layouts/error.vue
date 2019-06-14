<template>
  <div>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { ErrorParams } from '@nuxt/vue-app'

@Component
export default class extends Vue {
  @Prop(Object) readonly error!: ErrorParams

  mounted(): void {
    console.log('error layout mounted')
  }
}
</script>
