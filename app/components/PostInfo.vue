<template>
  <div class="info">
    <div>
      <NuxtLink
        v-for="category in categories"
        :key="category.term_id"
        :to="`/category/${category.slug}`"
        class="category"
      >
        {{ category.name }}
      </NuxtLink>
    </div>
    <div class="date">
      {{ formatDate(date) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

defineProps<{
  categories: WordPress.Category[]
  date: string
}>()

function formatDate(date: string) {
  return dayjs(date).format('YYYY/M/D')
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
    margin-right: 0.4em;
    content: ',';
  }

  &:last-child::after {
    display: none;
    content: '';
  }
}

.date {
  margin-left: 0.8em;
}
</style>
