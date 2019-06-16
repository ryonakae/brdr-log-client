<template>
  <article>
    <h1 class="title">
      <n-link :to="`/post/${post.id}`">{{ post.title.rendered }}</n-link>
    </h1>
    <Info class="info" :categories="post._categories" :date="post.date" />
  </article>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Info from '~/components/Info.vue'

import * as WordPress from 'wordpress'

@Component({
  components: {
    Info
  }
})
export default class extends Vue {
  @Prop({ type: Object, required: true }) readonly post!: WordPress.Post
}
</script>

<style scoped>
.title {
  margin: 0;
  font-size: var(--fontSize-h2);

  & :any-link {
    color: inherit;
  }
}

.info {
  margin-top: 0.5rem;
}
</style>
