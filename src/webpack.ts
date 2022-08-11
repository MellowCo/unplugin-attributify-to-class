import type { Options } from './types'
import { defaultAttributes, defaultIgnoreNonValuedAttributes } from './core'
import unplugin from '.'

const presetAttributifyWechat = unplugin.webpack as (options?: Options) => any

// TODO: some upstream lib failed generate invalid dts, remove the any in the future
export {
  presetAttributifyWechat,
  defaultAttributes,
  defaultIgnoreNonValuedAttributes,
}
