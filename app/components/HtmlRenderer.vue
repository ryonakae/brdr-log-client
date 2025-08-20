<template>
  <component :is="renderedContent" />
</template>

<script setup lang="ts">
import { NuxtImg, NuxtLink } from '#components'

const config = useRuntimeConfig()

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
    let imgSrc = src

    // 画像のURLが `${wpSiteUrl}/wp-content/uploads` で始まる場合は相対パスに変換
    // imgixEnabledがtrueの場合のみ
    if (config.public.imgixEnabled && imgSrc && imgSrc.startsWith(`${config.public.wpSiteUrl}/wp-content/uploads`)) {
      imgSrc = imgSrc.replace(`${config.public.wpSiteUrl}/wp-content/uploads`, '')
    }

    return h(NuxtImg, {
      provider: config.public.imgixEnabled && 'imgix',
      src: imgSrc,
      alt,
      width,
      height,
      loading,
      class: className,
      modifiers: {
        auto: 'compress,format',
        lossless: 0,
        fit: 'max',
        q: 95,
      },
    })
  },
}

const { renderedContent } = useHtml(props.html, customComponents)
</script>
