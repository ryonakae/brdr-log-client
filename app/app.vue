<template>
  <div class="app">
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

useHead({
  htmlAttrs: {
    lang: 'ja',
  },
  link: [
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'favicon', href: '' },
  ],
})
useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${siteInfo.title}` : `${siteInfo.title}`
  },
  description: siteInfo.description,
  ogSiteName: siteInfo.title,
  ogUrl: route.path === '/' ? siteInfo.url : `${siteInfo.url}/${route.path}`,
  ogImage: siteInfo.url + '/ogp.png',
  ogType: 'website',
  ogLocale: 'ja_JP',
  twitterCard: 'summary',
  colorScheme: 'light dark',
  robots: 'index,follow,noarchive',
})
</script>

<style scoped>
.app {
  max-width: calc(var(--max-width-site) + var(--margin-site) * 2);
  padding: var(--margin-content) var(--margin-site);
  margin: 0 auto;
}
</style>
