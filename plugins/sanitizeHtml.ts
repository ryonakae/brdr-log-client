import sanitizeHtml from 'sanitize-html'

export default (_: any, inject: any): void => {
  inject(
    'sanitizeHtml',
    (dirty: string, options?: sanitizeHtml.IOptions): string => {
      return sanitizeHtml(dirty, options)
    }
  )
}
