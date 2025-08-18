const accentColors = ['#ff059c', '#f6ff07', '#06c9ff', '#4e06ff', '#06ff0a']

function updateCSSCustomProperty(color: string) {
  document.documentElement.style.setProperty('--color-accent', color)
}

function updateFavicon(color: string) {
  const favicon = document.querySelector('link[rel="favicon"]')
  console.log('favicon:', favicon)

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  console.log('context:', context)

  if (favicon && context) {
    const size = 64
    canvas.width = size
    canvas.height = size

    context.fillStyle = color
    context.fillRect(0, 0, size, size)

    const image = canvas.toDataURL('image/png')
    console.log('newFavicon:', image)
    favicon.setAttribute('href', image)
  }
}

export default defineNuxtPlugin((_nuxtApp) => {
  const router = useRouter()

  router.afterEach(async () => {
    const accentColor
      = accentColors[Math.floor(Math.random() * accentColors.length)] as string
    console.log('accentColor:', accentColor)

    updateCSSCustomProperty(accentColor)
    updateFavicon(accentColor)
  })
})
