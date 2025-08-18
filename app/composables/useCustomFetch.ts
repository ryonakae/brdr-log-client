type NuxtFetch = typeof $fetch
type FetchRequest = Parameters<NuxtFetch>[0]
type FetchOptions = Parameters<NuxtFetch>[1]

export function useCustomFetch<T>(
  url: FetchRequest,
  options?: FetchOptions,
) {
  const config = useRuntimeConfig()

  return $fetch<T>(url, {
    baseURL: config.public.wpSiteUrl + '/wp-json/wp/v2',
    ...options,
  })
}
