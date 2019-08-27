import { promisify } from 'util'
import * as fs from 'fs-extra'
import { Feed } from 'feed'
import * as WordPress from 'wordpress'
import { FeedOptions } from 'feed/lib/typings'

export default class Post {
  private feed?: Feed

  public constructor(options: FeedOptions) {
    this.feed = new Feed(options)
    console.log('create feed', options)
  }

  public addItem(post: WordPress.Post): void {
    if (!this.feed) return

    let eyecatch: string | undefined
    if (post._embedded['wp:featuredmedia']) {
      eyecatch =
        post._embedded['wp:featuredmedia'][0].media_details.sizes['post-large']
          .source_url
    } else {
      eyecatch = undefined
    }

    this.feed.addItem({
      title: post.title.rendered,
      link: `${this.feed.options.id}/post/${post.id}`,
      date: new Date(post.date),
      description: post._excerpt,
      content: post.content.rendered,
      image: eyecatch,
      author: [{ name: (post.author as unknown) as string }]
    })

    console.log('feed addItem')
  }

  public async generate(path: string): Promise<void> {
    if (!this.feed) return

    await promisify(fs.writeFile)(path, this.feed.rss2())
    console.log('rss feed generate complete')
  }
}
