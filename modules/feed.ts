import { promisify } from 'util'
import * as fs from 'fs-extra'
import { Feed } from 'feed'
import * as WordPress from 'wordpress'
import { FeedOptions } from 'feed/lib/typings'

export default class Post {
  private feed?: Feed

  public constructor(options: FeedOptions) {
    this.feed = new Feed(options)
  }

  public addItem(post: WordPress.Post): void {
    if (!this.feed) return

    let eyecatch: string | undefined
    if (post._embedded['wp:featuredmedia']) {
      eyecatch = post._embedded['wp:featuredmedia'][0].source_url
    } else {
      eyecatch = undefined
    }

    this.feed.addItem({
      title: post.title.rendered,
      link: `${this.feed.options.id}/post/${post.id}`,
      date: new Date(post.date),
      content: post._excerpt,
      image: eyecatch
    })
  }

  public async generate(path: string): Promise<void> {
    if (!this.feed) return
    await promisify(fs.writeFile)(path, this.feed.rss2())
  }
}
