import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import type { Options } from './types'
import { extractorAttributify } from './core/extractor'

const filter = createFilter(
  [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/],
  [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
)

export default createUnplugin<Options>((options) => {
  const extractor = extractorAttributify(options)

  return {
    name: 'unplugin-unocss-attributify-wechat',
    enforce: 'pre',
    transformInclude(id) {
      return filter(id)
    },
    transform(code) {
      return extractor(code)
    },
  }
})
