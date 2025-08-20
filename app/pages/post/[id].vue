<template>
  <article
    v-if="data"
    class="post"
  >
    <figure
      v-if="data.post._thumbnail"
      class="eyecatch"
    >
      <NuxtImg
        :provider="config.public.imgixEnabled && 'imgix'"
        :src="getEyecatchSrc(data.post._thumbnail.url)"
        :alt="data.post.title.rendered"
        :width="data.post._thumbnail.width"
        :height="data.post._thumbnail.height"
        loading="lazy"
        :modifiers="{
          auto: 'compress,format',
          lossless: 0,
          fit: 'max',
          q: 95,
        }"
      />
    </figure>

    <h1 class="title">
      {{ data.post.title.rendered }}
    </h1>

    <PostInfo
      class="info"
      :categories="data.post._categories"
      :date="data.post.date"
    />

    <div class="content">
      <HtmlRenderer :html="data.post.content.rendered" />
    </div>

    <div class="backtop">
      <NuxtLink to="/">Back to Index</NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

// asyncData
const { data, error } = await useAsyncData(
  `post-${route.params.id}`,
  async () => {
    const post = await useCustomFetch<WordPress.Post>(`/posts/${route.params.id}`, {
      query: {
        _embed: '',
      },
    })
    // console.log('post:', post)

    return { post }
  },
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
    fatal: error.value.fatal,
  })
}

// methods
function getEyecatchSrc(src: string) {
  // 画像のURLが `${wpSiteUrl}/wp-content/uploads` で始まる場合は相対パスに変換
  // imgixEnabledがtrueの場合のみ
  if (config.public.imgixEnabled && src.startsWith(`${config.public.wpSiteUrl}/wp-content/uploads`)) {
    return src.replace(`${config.public.wpSiteUrl}/wp-content/uploads`, '')
  }
  return src
}
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
    display: flex;
    flex-direction: column;
    gap: 0.25em;
    line-height: var(--lineHeight-heading);

    &::before {
      font-size: var(--fontSize-extra-small);
      font-weight: 400;
      color: var(--color-caption);
    }
  }

  & h1 {
    &::before {
      content: 'H1';
    }
    border-bottom: 3px dashed var(--color-border);
    padding-bottom: 0.25em;
  }
  & h2 {
    &::before {
      content: 'H2';
    }
    border-bottom: 2px dashed var(--color-border);
    padding-bottom: 0.25em;
  }
  & h3 {
    &::before {
      content: 'H3';
    }
  }
  & h4 {
    &::before {
      content: 'H4';
    }
  }
  & h5 {
    &::before {
      content: 'H5';
    }
  }
  & h6 {
    &::before {
      content: 'H6';
    }
  }

  & p,
  & figure,
  & ul,
  & ol,
  & blockquote,
  & pre {
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }

  & ul,
  & ol {
    padding-left: 1.25em;

    & ul {
      margin: 0;
    }
  }

  & figure {
    margin-right: 0;
    margin-left: 0;
    text-align: center;
  }

  & img {
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
    padding-left: 0.8rem;
    margin-right: 0;
    margin-left: 0;
    font-style: italic;
    border-left: 3px dashed var(--color-border);
  }

  & hr {
    width: 5rem;
    margin: var(--margin-content) auto;
    border: none;
    border-top: 3px dashed var(--color-border);
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
