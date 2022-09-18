import presetWeapp from 'unocss-preset-weapp'
import { transformerAttributify, transformerClass } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      prefix: 'li-',
    }),
  ],
  transformers: [
    transformerAttributify({
      nonValuedAttribute: true,
      classPrefix: 'li-',
    }),

    transformerClass(),
  ],
})
