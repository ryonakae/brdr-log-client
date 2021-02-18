import { Context } from '@nuxt/types'

const accentColors = ['#ff059c', '#f6ff07', '#06c9ff', '#4e06ff', '#06ff0a']

export default (ctx: Context): void => {
  if (!ctx.app.router) return

  ctx.app.router.beforeEach((to, from, next): void => {
    console.log('router beforeEach', to.name, from.name)
    next()
  })

  ctx.app.router.afterEach((to, from): void => {
    console.log('router afterEach', to.name, from.name)

    const accentColor =
      accentColors[Math.floor(Math.random() * accentColors.length)]
    document.documentElement.style.setProperty('--color-accent', accentColor)
  })
}
