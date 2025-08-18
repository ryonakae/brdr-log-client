import type { UseFetchOptions } from 'nuxt/app'

export function useCustomFetch<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  const config = useRuntimeConfig()

  return useFetch(url, {
    ...options,
    baseURL: config.wpSiteUrl + '/wp-json/wp/v2',
    $fetch: useNuxtApp().$api as typeof $fetch,
  })
}
