<template>
  <div class="info">
    <div>
      <n-link
        v-for="category in categories"
        :key="category.term_id"
        :to="`/category/${category.slug}`"
        class="category"
        >{{ category.name }}</n-link
      >
    </div>
    <div class="date">{{ formattedDate }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import dayjs from 'dayjs'

import * as WordPress from 'wordpress'

@Component
export default class extends Vue {
  @Prop({ type: Array, required: true })
  readonly categories!: WordPress.Category[]

  @Prop({ type: String, required: true })
  readonly date!: string

  get formattedDate(): string {
    return dayjs(this.date).format('YYYY/M/D')
  }
}
</script>

<style scoped>
.info {
  display: flex;
  font-size: var(--fontSize-small);
  color: var(--color-caption);
}

.category {
  &::after {
    content: ', ';
  }

  &:last-child::after {
    display: none;
    content: '';
  }
}

.date {
  margin-left: 1em;
}
</style>
