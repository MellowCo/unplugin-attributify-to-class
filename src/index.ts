import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import { defaultAttributes, extractorAttributify } from './core/extractor'

export {
  defaultAttributes,
}

export default createUnplugin<Options>(options => ({
  name: 'unplugin-unocss-attributify-wechat',
  enforce: 'pre',
  transformInclude(id) {
    return !id.includes('node_modules') && /.vue$/.test(id)
  },
  transform(code) {
    return extractorAttributify(options)(code)
  },
}))
