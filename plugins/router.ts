import { Context } from '@nuxt/types'

const accentColors = ['#ff059c', '#f6ff07', '#06c9ff', '#4e06ff', '#06ff0a']

const updateFavicon = (color: string) => {
  const favicon = document.querySelector('link[rel="icon"]')
  console.log(favicon)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  const size = 64

  if (!favicon || !context) return

  canvas.width = size
  canvas.height = size

  context.fillStyle = color
  context.fillRect(0, 0, size, size)

  const image = canvas.toDataURL('image/png')
  favicon.setAttribute('href', image)
}

export default (ctx: Context): void => {
  const router = ctx.app.router

  if (!router) return

  router.beforeEach((to, from, next): void => {
    console.log('router beforeEach', to.name, from.name)
    next()
  })

  router.afterEach((to, from): void => {
    console.log('router afterEach', to.name, from.name)

    const accentColor =
      accentColors[Math.floor(Math.random() * accentColors.length)]
    document.documentElement.style.setProperty('--color-accent', accentColor)

    router.app.$nextTick(() => {
      updateFavicon(accentColor)
    })
  })
}
