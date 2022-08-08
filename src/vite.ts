import type { Options } from './types'
import { defaultAttributes } from './core/extractor'
import unplugin from '.'

export {
  defaultAttributes,
}

// TODO: some upstream lib failed generate invalid dts, remove the any in the future
export default unplugin.vite as (options?: Options) => any
