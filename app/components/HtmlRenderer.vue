<template>
  <component :is="renderedContent" />
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{
  html: string
}>()

const { renderedContent } = useHtml(props.html, {
  a: (props) => {
    let linkTo = props.href

    // サイトのURLで始まる場合は相対パスに変換
    if (typeof linkTo === 'string' && linkTo.startsWith(siteInfo.url)) {
      linkTo = linkTo.replace(siteInfo.url, '')
    }

    return h(
      NuxtLink,
      { to: linkTo, target: props.target, rel: props.rel },
      // 子要素を関数として渡す
      () => props.children,
    )
  },
})
</script>
