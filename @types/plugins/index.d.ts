import * as sanitizeHtml from 'sanitize-html'
import '@nuxtjs/axios'

declare module 'vue/types/vue' {
  interface SanitizeHtml {
    (dirty: string, options?: sanitizeHtml.IOptions): string
  }

  interface Vue {
    $sanitizeHtml: SanitizeHtml
  }
}
