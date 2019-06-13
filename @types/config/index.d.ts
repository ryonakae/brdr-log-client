import NuxtConfiguration from '@nuxt/config'
import { AxiosRequestConfig } from 'axios'
import { MetaInfo } from 'vue-meta'

declare module 'config' {
  interface MyNuxtConfiguration extends NuxtConfiguration {
    axios?: AxiosRequestConfig
  }

  interface Head extends MetaInfo {
    meta?: {
      hid?: string
      charset?: string
      content?: string
      'http-equiv'?: 'content-security-policy' | 'refresh'
      name?: string
      property?: string
      [key: string]: any
      template?: string | ((chunk: string) => string)
    }[]
  }
}
