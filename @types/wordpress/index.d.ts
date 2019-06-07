declare module 'wordpress' {
  interface Category {
    term_id: number
    name: string
    slug: string
    term_group: number
    term_taxonomy_id: number
    taxonomy: string
    description: string
    parent: number
    count: number
  }

  interface Term {
    id: number
    link: string
    name: string
    slug: string
    taxonomy: string
  }

  interface MediaSize {
    file: string
    width: number
    heigt: number
    mime_type: string
    source_url: string
  }

  interface Media {
    id: number
    date: string
    slug: string
    type: string
    link: string
    title: {
      rendered: string
    }
    author: number
    caption: {
      rendered: string
    }
    alt_text: string
    media_type: 'image' | 'file'
    mime_type: string
    media_details: {
      width: number
      height: number
      file: string
      sizes: {
        medium: MediaSize
        theme_eyecatch: MediaSize
        full: MediaSize
      }
    }
    source_url: string
  }

  interface Author {
    id: number
    name: string
    url: string
    description: string
    link: string
    slug: string
    avatar_urls: {
      [key: number]: string
    }
  }

  interface Post {
    id: number
    date: string
    modified: string
    slug: string
    status: 'publish' | 'future' | 'draft' | 'pending' | 'private'
    type: string
    link: string
    title: {
      rendered: string
    }
    content: {
      rendered: string
    }
    excerpt: {
      rendered: string
    }
    author: number
    featured_media: number
    sticky: boolean
    template: string
    format:
      | 'standard'
      | 'aside'
      | 'chat'
      | 'gallery'
      | 'link'
      | 'image'
      | 'quote'
      | 'status'
      | 'video'
      | 'audio'
    categories: number[]
    _categories: Category[]
    _excerpt: string
    _embedded: {
      author: Author[]
      'wp:featuredmedia'?: Media
      'wp:term': Term[]
    }
  }
}
