import type { Options } from './types'
import { defaultAttributes } from './core/extractor'
import unplugin from '.'

// TODO: some upstream lib failed generate invalid dts, remove the any in the future
export default {
  presetAttributifyWechat: unplugin.webpack as (options?: Options) => any,
  defaultAttributes,
}
