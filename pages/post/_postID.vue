<template>
  <article class="post">
    <figure v-if="post._embedded['wp:featuredmedia']" class="eyecatch">
      <img
        :src="
          post._embedded['wp:featuredmedia'][0].media_details.sizes[
            'post-large'
          ].source_url
        "
        :alt="post.title.rendered"
      />
    </figure>

    <h1 class="title">{{ post.title.rendered }}</h1>

    <Info class="info" :categories="post._categories" :date="post.date" />

    <div class="content" v-html="post.content.rendered" />

    <div class="backtop">
      <n-link to="/">Back to Index</n-link>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Info from '~/components/Info.vue'

import * as Config from 'config'
import * as WordPress from 'wordpress'
import { Context } from '@nuxt/vue-app'
import { AxiosError } from 'axios'

@Component({
  components: {
    Info
  }
})
export default class extends Vue {
  // head
  head(): Config.Head {
    return {
      title: this.post.title.rendered,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.post._excerpt
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.post.title.rendered
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.post._excerpt
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: process.env.SITE_URL + this.$route.path
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.ogImage
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'article'
        },
        {
          hid: 'twitter:card',
          name: 'twitter:card',
          content: this.twitterCard
        }
      ],
      script: [
        {
          src: 'https://platform.twitter.com/widgets.js',
          type: 'text/javascript',
          body: true
        },
        {
          src: 'https://www.instagram.com/embed.js',
          type: 'text/javascript',
          body: true
        }
      ]
    }
  }

  // data
  private post!: WordPress.Post

  // asyncData
  async asyncData(ctx: Context): Promise<void | object> {
    const post: WordPress.Post = await ctx.app.$axios
      .$get(`/posts/${ctx.params.postID}`, {
        params: {
          _embed: ''
        }
      })
      .catch((err: AxiosError): void => {
        if (err.response) {
          return ctx.error({
            statusCode: err.response.status,
            message: err.response.statusText
          })
        }
      })

    console.log(post)

    return { post: post }
  }

  // computed
  get ogImage(): string {
    return this.post._embedded['wp:featuredmedia']
      ? this.post._embedded['wp:featuredmedia'][0].media_details.sizes[
          'post-large'
        ].source_url
      : process.env.SITE_URL + '/ogp.png'
  }

  get twitterCard(): string {
    return this.post._embedded['wp:featuredmedia']
      ? 'summary_large_image'
      : 'summary'
  }
}
</script>

<style scoped>
.post {
  width: 100%;
  overflow-x: hidden;
}

.eyecatch {
  margin: 0 0 var(--margin-content);

  & img {
    width: 100%;
    height: auto;
    vertical-align: top;
    background-color: var(--color-border);
    border-radius: var(--radius-image);
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
    position: relative;
    padding-right: 1.5rem;
    margin-top: 1.9em;

    &::before {
      position: absolute;
      top: 0.1em;
      right: 0;
      font-size: 0.7rem;
      color: var(--color-caption);
    }
  }

  & h1::before {
    content: 'H1';
  }

  & h2::before {
    content: 'H2';
  }

  & h3::before {
    content: 'H3';
  }

  & h4::before {
    content: 'H4';
  }

  & h5::before {
    content: 'H5';
  }

  & h6::before {
    content: 'H6';
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
    background-color: var(--color-border);
    border-radius: var(--radius-image);
  }

  & figcaption {
    margin-top: 1em;
    font-size: var(--fontSize-small);
    color: var(--color-caption);
  }

  & code {
    font-family: var(--fontFamily-code);
    font-size: var(--fontSize-code);
    background-color: var(--color-border);
    border-radius: var(--radius-image);
  }

  & pre {
    padding: 1em;
    overflow-x: auto;
    word-wrap: normal;
    background-color: var(--color-border);
    border-radius: var(--radius-image);

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
    height: 3px;
    margin: var(--margin-content) auto;
    background-color: var(--color-border);
    border: none;
    border-radius: var(--radius-image);
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
      background-color: var(--color-border);
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
