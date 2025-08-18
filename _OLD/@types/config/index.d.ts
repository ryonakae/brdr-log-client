import { Configuration } from '@nuxt/types'
import { AxiosRequestConfig } from 'axios'
import { MetaInfo } from 'vue-meta'
import {
  MetaPropertyCharset,
  MetaPropertyEquiv,
  MetaPropertyName,
  MetaPropertyMicrodata,
  MetaPropertyProperty
} from 'vue-meta/types/vue-meta'

interface HeadWeaken extends MetaInfo {
  meta?: any
}

declare module 'config' {
  interface Head extends HeadWeaken {
    meta?: (
      | MetaPropertyCharset
      | MetaPropertyEquiv
      | MetaPropertyName
      | MetaPropertyMicrodata
      | MetaPropertyProperty
      | { hid?: string }
    )[]
  }
}
