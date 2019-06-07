import NuxtConfiguration from '@nuxt/config'
import { AxiosRequestConfig } from 'axios'
import { MetaInfo } from 'vue-meta'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { Context } from '@nuxt/vue-app'

declare module 'config' {
  interface NuxtAxiosRequestConfig extends AxiosRequestConfig {
    retry?: {
      retries: number
    }
    init?(axios: NuxtAxiosInstance, ctx: Context): void
  }

  interface MyNuxtConfiguration extends NuxtConfiguration {
    axios?: NuxtAxiosRequestConfig
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
