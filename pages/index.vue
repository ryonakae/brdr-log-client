<template>
  <h1>Index</h1>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  async mounted(): Promise<void> {
    await this.$nextTick()
    console.log('index mounted')
    console.log(process.env.WP_SITE_URL)

    const res = await this.$axios.get(
      process.env.WP_SITE_URL + '/wp-json/wp/v2/posts'
    )
    console.log(res)
  }
}
</script>
