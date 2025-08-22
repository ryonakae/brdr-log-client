import type { Feed } from 'nuxt-module-feed'

// node_modules/nuxt-module-feed/dist/module.d.ts
type FeedType = 'rss2' | 'atom1' | 'json1'
interface SourceOptions {
  path: string
  type: FeedType
  cacheTime: number
}
interface NitroCtx {
  feed: Feed
  options: SourceOptions
}
declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'feed:generate': (ctx: NitroCtx) => void
  }
}

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('feed:generate', async ({ feed, options }: NitroCtx) => {
    if (options.path === '/feed.xml') {
      await createFeed(feed)
    }
  })
})

async function createFeed(feed: Feed) {
  // フィードの基本情報を設定
  feed.options = {
    id: siteInfo.url,
    title: siteInfo.title,
    description: siteInfo.description,
    link: siteInfo.url,
    language: 'ja',
    image: `${siteInfo.url}/ogp.png`,
    favicon: `${siteInfo.url}/favicon.ico`,
    copyright: '© Ryo Nakae',
    updated: new Date(),
  }

  // WordPress APIから記事を取得
  const wpSiteUrl = process.env.NUXT_PUBLIC_WP_SITE_URL as string
  const apiUrl = `${wpSiteUrl}/wp-json/wp/v2/posts`

  const posts = await $fetch<WordPress.Post[]>(apiUrl, {
    query: {
      _embed: '',
      per_page: 100,
    },
  })

  // 記事をフィードアイテムとして追加
  posts.forEach((post) => {
    const postUrl = `${siteInfo.url}/post/${post.id}`
    const publishedDate = new Date(post.date)

    // アイキャッチ画像の取得
    let eyecatchUrl: string | undefined = undefined
    if (post._embedded['wp:featuredmedia']) {
      eyecatchUrl = post._embedded['wp:featuredmedia'][0].source_url
    }

    feed.addItem({
      title: post.title.rendered,
      id: postUrl,
      link: postUrl,
      description: post._excerpt,
      // content: post.content.rendered,
      date: publishedDate,
      image: eyecatchUrl,
    })
  })
}
