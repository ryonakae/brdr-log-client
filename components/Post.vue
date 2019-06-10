<template>
  <article>
    <h1>
      <n-link :to="`/post/${post.id}`">{{ post.title.rendered }}</n-link>
    </h1>
    <div>{{ getDate(post.date) }}</div>
    <div v-for="category in post._categories" :key="category.term_id">
      <n-link :to="`/category/${category.slug}`">{{ category.name }}</n-link>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import * as WordPress from 'wordpress'

@Component
export default class extends Vue {
  @Prop(Object) readonly post!: WordPress.Post

  getDate(date: string): string {
    return dayjs(date).format('YYYY/M/D')
  }
}
</script>
