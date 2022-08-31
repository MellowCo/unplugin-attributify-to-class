import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import type { Options } from './types'
import { extractorAttributify } from './core'

export default createUnplugin<Options>((options) => {
  const extractor = extractorAttributify(options)

  const filter = createFilter(
    options.include || [/\.vue$/, /\.vue\?vue/],
    options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
  )

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
