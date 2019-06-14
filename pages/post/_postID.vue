<template>
  <article class="post">
    <figure v-if="post._embedded['wp:featuredmedia']">
      <img
        :src="
          post._embedded['wp:featuredmedia'][0].media_details.sizes.medium
            .source_url
        "
        :alt="post.title.rendered"
      />
    </figure>
    <h1>
      <a :href="`/post/${post.id}`">{{ post.title.rendered }}</a>
    </h1>
    <div>{{ getDate(post.date) }}</div>
    <div v-for="category in post._categories" :key="category.term_id">
      <n-link :to="`/category/${category.slug}`">{{ category.name }}</n-link>
    </div>
    <div v-html="post.content.rendered" />
    <n-link to="/">Back to Index</n-link>
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'

import * as Config from 'config'
import * as WordPress from 'wordpress'
import { Context } from '@nuxt/vue-app'
import { AxiosError } from 'axios'

@Component
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
    let ogImage: string

    if (this.post._embedded['wp:featuredmedia']) {
      ogImage = this.post._embedded['wp:featuredmedia'][0].media_details.sizes
        .medium.source_url
    } else {
      ogImage = process.env.SITE_URL + '/ogp.png'
    }

    return ogImage
  }

  // methods
  getDate(date: string): string {
    return dayjs(date).format('YYYY/M/D')
  }
}
</script>

<style scoped>
.post {
  width: 100%;
  overflow-x: hidden;
}
</style>

<style>
h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 1.8em;
}

p,
figure,
ul,
ol,
blockquote,
pre {
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}

ul,
ol {
  padding-left: 1.25em;
}

figure {
  margin-right: 0;
  margin-left: 0;
  text-align: center;
}

img {
  max-width: 100%;
  height: auto;
  vertical-align: top;
  border-radius: var(--radius-image);
}

figcaption {
  margin-top: 1em;
  font-size: var(--fontSize-small);
  color: var(--color-caption);
}

code {
  font-family: var(--fontFamily-code);
  font-size: var(--fontSize-code);
  background-color: var(--color-imageBg);
  border-radius: var(--radius-image);
}

pre {
  padding: 1em;
  overflow-x: auto;
  word-wrap: normal;
  background-color: var(--color-imageBg);
  background-clip: padding-box;
  border-radius: var(--radius-image);

  & code {
    display: block;
    line-height: var(--lineHeight-code);
    white-space: pre;
    background: none;
  }
}

blockquote {
  padding-left: 1em;
  margin-right: 0;
  margin-left: 0;

  /* color: var(--color-caption); */
  font-style: italic;
  border-left: 2px solid var(--color-imageBg);
}

hr {
  width: 5em;
  height: 2px;
  margin: 3em auto;
  background-color: var(--color-imageBg);
  border: none;
  border-radius: var(--radius-image);
}
</style>
