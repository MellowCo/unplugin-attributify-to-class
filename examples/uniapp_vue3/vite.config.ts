import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import Unocss from 'unocss/vite'
import transformWeClass from 'unplugin-transform-class/vite'
import { attributifyToClass, defaultAttributes, defaultIgnoreNonValuedAttributes } from 'unplugin-attributify-to-class/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // https://github.com/MellowCo/unplugin-attributify-to-class
    attributifyToClass({
      attributes: [...defaultAttributes, 'my-attr'],
      ignoreNonValuedAttributes: [...defaultIgnoreNonValuedAttributes, 'my-ignore'],
      nonValuedAttribute: true,
      prefix: 'li-',
      prefixedOnly: true,
    }),
    // https://github.com/unocss/unocss
    Unocss(),
    // https://github.com/MellowCo/unplugin-transform-class
    transformWeClass(),
  ],
})
