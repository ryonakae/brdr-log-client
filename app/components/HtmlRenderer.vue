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
  a: ({ href, children, ...props }) => {
    let linkTo = href

    // サイトのURLまたはWordPressサイトのURLで始まる場合は相対パスに変換
    if (linkTo) {
      let searchValue: string | null = null

      if (linkTo.startsWith(siteInfo.url)) {
        searchValue = siteInfo.url
      }
      else if (linkTo.startsWith(config.public.wpSiteUrl)) {
        searchValue = config.public.wpSiteUrl
      }

      if (searchValue) {
        linkTo = linkTo.replace(searchValue, '')
      }
    }

    return h(
      NuxtLink,
      { to: linkTo, ...props },
      () => children,
    )
  },
  img: ({ src, alt, width, height, class: className }) => {
    const { src: imgSrc, provider, modifiers } = useImgix(src)

    return h(NuxtImg, {
      class: className,
      src: imgSrc,
      width,
      height,
      alt,
      sizes: '100vw sm:640px md:800px',
      densities: '1x 2x',
      provider,
      loading: 'lazy',
      modifiers,
    })
  },
}

const { renderedContent } = useHtml(props.html, customComponents)
</script>
