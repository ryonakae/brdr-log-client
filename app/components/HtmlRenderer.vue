<template>
  <component :is="renderedContent" />
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{
  html: string
}>()

const customComponents: CustomComponents = {
  a: ({ href, ...props }) => {
    let linkTo = href

    // サイトのURLで始まる場合は相対パスに変換
    if (linkTo && linkTo.startsWith(siteInfo.url)) {
      linkTo = linkTo.replace(siteInfo.url, '')
    }

    return h(
      NuxtLink,
      { to: linkTo, ...props },
      () => props.children,
    )
  },
}

const { renderedContent } = useHtml(props.html, customComponents)
</script>
