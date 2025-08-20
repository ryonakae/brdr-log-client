<template>
  <component :is="renderedContent" />
</template>

<script setup lang="ts">
import { NuxtImg, NuxtLink } from '#components'

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
  img: ({ src, alt, width, height, loading, class: className }) => {
    const { src: imgSrc, provider, modifiers } = useImgix(src)

    return h(NuxtImg, {
      provider,
      src: imgSrc,
      alt,
      width,
      height,
      loading,
      class: className,
      modifiers,
    })
  },
}

const { renderedContent } = useHtml(props.html, customComponents)
</script>
