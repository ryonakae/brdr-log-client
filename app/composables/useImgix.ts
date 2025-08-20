/**
 * 画像プロパティの型定義
 */
interface ImgProps {
  src: string
  provider?: string
  modifiers: Record<string, any>
}

/**
 * Imgixの設定と画像URL変換を行うコンポーザブル
 * @param src 元の画像URL（省略可能）
 * @returns 変換後のsrcとprovider情報、modifiers
 */
export function useImgix(src?: string): ImgProps {
  let wpSiteUrl: string
  let imgixEnabled: boolean

  if (import.meta.server) {
    wpSiteUrl = process.env.NUXT_PUBLIC_WP_SITE_URL as string
    imgixEnabled = process.env.NUXT_PUBLIC_IMGIX_ENABLED === 'true'
  }
  else {
    const config = useRuntimeConfig()
    wpSiteUrl = config.public.wpSiteUrl
    imgixEnabled = Boolean(config.public.imgixEnabled)
  }

  let imgSrc = src || ''

  // imgixEnabledがtrueの場合のみ、
  // 画像のURLが `${wpSiteUrl}/wp-content/uploads` で始まる場合は相対パスに変換
  if (imgixEnabled && src && src.startsWith(`${wpSiteUrl}/wp-content/uploads`)) {
    imgSrc = src.replace(`${wpSiteUrl}/wp-content/uploads`, '')
  }

  return {
    src: imgSrc,
    provider: imgixEnabled ? 'imgix' : undefined,
    modifiers: {
      auto: 'compress,format',
      lossless: 0,
      fit: 'max',
      q: 95,
    },
  }
}
