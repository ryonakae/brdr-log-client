<template>
  <main>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <n-link to="/">Back to Index</n-link>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { ErrorParams } from '@nuxt/vue-app'

@Component
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly error!: ErrorParams
}
</script>
