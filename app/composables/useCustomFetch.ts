type NuxtFetch = typeof $fetch
type FetchRequest = Parameters<NuxtFetch>[0]
type FetchOptions = Parameters<NuxtFetch>[1]

export function useCustomFetch<T>(
  url: FetchRequest,
  options?: FetchOptions,
) {
  let wpSiteUrl

  if (import.meta.server) {
    wpSiteUrl = process.env.NUXT_PUBLIC_WP_SITE_URL as string
  }
  else {
    wpSiteUrl = useRuntimeConfig().public.wpSiteUrl
  }

  return $fetch<T>(url, {
    baseURL: wpSiteUrl + '/wp-json/wp/v2',
    ...options,
  })
}
