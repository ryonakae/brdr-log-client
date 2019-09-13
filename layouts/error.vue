<template>
  <main>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <n-link to="/">Back to Index</n-link>
  </main>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { NuxtError } from '@nuxt/types/app'
import * as Config from 'config'

@Component
export default class extends Vue {
  // props
  @Prop({ type: Object, required: true })
  readonly error!: NuxtError

  // head
  head(): Config.Head {
    return {
      titleTemplate: undefined,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: process.env.SITE_TITLE,
          template: '%s'
        }
      ]
    }
  }
}
</script>
