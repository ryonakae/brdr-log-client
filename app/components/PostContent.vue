<template>
  <article class="post">
    <figure
      v-if="post._thumbnail"
      class="eyecatch"
    >
      <NuxtImg
        :src="eyacatchImgProps.src"
        :width="post._thumbnail.width"
        :height="post._thumbnail.height"
        :alt="post.title.rendered"
        sizes="100vw sm:640px md:880px"
        densities="1x 2x"
        :provider="eyacatchImgProps.provider"
        preload
        loading="lazy"
        :modifiers="eyacatchImgProps.modifiers"
      />
    </figure>

    <h1 class="title">
      <template v-if="isPreview">
        [Preview]
      </template>{{ post.title.rendered }}
    </h1>

    <PostInfo
      class="info"
      :categories="post._categories"
      :date="post.date"
    />

    <div class="content">
      <HtmlRenderer :html="post.content.rendered" />
    </div>

    <div class="backtop">
      <NuxtLink to="/">Back to Index</NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

const props = defineProps<{
  post: WordPress.Post
  isPreview?: boolean
}>()

// meta
useSeoMeta({
  robots: 'noindex, nofollow, noarchive',
  title: props.isPreview ? `[Preview] ${props.post.title.rendered}` : props.post.title.rendered,
  description: props.post._excerpt,
  ogImage:
    props.post._thumbnail
      ? config.public.imgixEnabled
        ? `https://${config.public.imgixImageDomain}${useImgix(props.post._thumbnail.url).src}?auto=compress,format&lossless=0&q=90&w=1200`
        : props.post._thumbnail.url
      : undefined,
  twitterCard: props.post._embedded['wp:featuredmedia'] && 'summary_large_image',
})

// computed
const eyacatchImgProps = computed(() => {
  if (!props.post?._thumbnail?.url) {
    return {
      provider: undefined,
      src: undefined,
      modifiers: {
        auto: 'compress,format',
        lossless: 0,
        fit: 'max',
        q: 95,
      },
    }
  }

  return useImgix(props.post._thumbnail.url)
})
</script>

<style scoped>
.post {
  width: 100%;
}

.eyecatch {
  margin: 0 calc(var(--margin-site) * -1) var(--margin-content);

  & img {
    width: 100%;
    height: auto;
    vertical-align: top;
    background-color: var(--color-bg-element);
  }
}

.title {
  margin: 0;
}

.info {
  margin-top: 0.5rem;
}

.content {
  margin-top: var(--margin-content);
  line-height: var(--lineHeight-content);

  & > *:first-child {
    margin-top: 0;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  & :any-link {
    display: unset;
  }
}

.backtop {
  margin-top: var(--margin-content);
  font-size: var(--fontSize-small);
}
</style>

<style>
.content {
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    margin-top: 2.5em;
    line-height: var(--lineHeight-heading);

    &::before {
      font-weight: 400;
      color: var(--color-caption);
      margin-right: 0.35em;
    }
  }

  & h1 {
    &::before {
      content: '#';
    }
    border-bottom: 3px dashed var(--color-border);
    padding-bottom: 0.25em;
  }
  & h2 {
    &::before {
      content: '##';
    }
    border-bottom: 2px dashed var(--color-border);
    padding-bottom: 0.25em;
  }
  & h3 {
    &::before {
      content: '###';
    }
  }
  & h4 {
    &::before {
      content: '####';
    }
  }
  & h5 {
    &::before {
      content: '#####';
    }
  }
  & h6 {
    &::before {
      content: '######';
    }
  }

  & p,
  & figure,
  & ul,
  & ol,
  & blockquote,
  & pre {
    margin-block: 1.5em;
  }

  & ul,
  & ol {
    padding-left: 1.25em;

    & ul {
      margin: 0;
    }
  }

  & figure {
    margin-inline: 0;
    text-align: center;
  }

  & img {
    width: 100%;
    max-width: 100%;
    height: auto;
    vertical-align: top;
    background-color: var(--color-bg-element);
  }

  & figcaption {
    margin-top: 1em;
    font-size: var(--fontSize-small);
    color: var(--color-caption);
  }

  & code {
    font-family: var(--fontFamily-code);
    font-size: var(--fontSize-code);
    background-color: var(--color-bg-element);
  }

  & pre {
    padding: 1em;
    overflow-x: auto;
    word-wrap: normal;
    background-color: var(--color-bg-element);

    & code {
      display: block;
      padding: 0;
      margin: 0;
      line-height: var(--lineHeight-code);
      white-space: pre;
      background: none;
    }
  }

  & blockquote {
    padding-left: 0.8em;
    margin-inline: 0;
    font-style: italic;
    border-left: 3px dashed var(--color-border);
  }

  & hr {
    width: 5em;
    margin: var(--margin-content) auto;
    border: none;
    border-top: 3px dashed var(--color-border);
  }

  & .wp-block-columns {
    margin-block: 1.5em;

    &.is-layout-flex {
      display: flex;
      gap: 1.5em;

      @media (--mobile) {
        flex-direction: column;
      }
    }

    & figure {
      margin: 0;
    }
  }

  & .wp-block-embed {
    &.is-type-video,
    &.is-provider-soundcloud {
      position: relative;
      height: 0;
      padding-bottom: 56.25%;
      overflow: hidden;

      & iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    &.is-type-video {
      background-color: var(--color-bg-element);
    }

    &.wp-embed-aspect-4-3 {
      padding-bottom: 75%;
    }

    &.wp-embed-aspect-16-9 {
      padding-bottom: 56.25%;
    }

    &.wp-embed-aspect-21-9 {
      padding-bottom: 42.86%;
    }
  }
}
</style>
