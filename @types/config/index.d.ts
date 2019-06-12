import NuxtConfiguration from '@nuxt/config'
import { AxiosRequestConfig } from 'axios'
import { MetaInfo } from 'vue-meta'
import { Context } from '@nuxt/vue-app'
import { Route } from 'vue-router'

declare module 'config' {
  interface MyNuxtConfiguration extends NuxtConfiguration {
    axios?: AxiosRequestConfig
  }

  interface MyContext extends Context {
    $payloadURL(route: Route): string
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
