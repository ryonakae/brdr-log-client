import type { UseFetchOptions } from 'nuxt/app'

export function useCustomFetch<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    baseURL: process.env.WP_SITE_URL + '/wp-json/wp/v2',
    $fetch: useNuxtApp().$api as typeof $fetch,
  })
}
