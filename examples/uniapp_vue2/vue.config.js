const UnoCSS = require('unocss-webpack-uniapp2').default
const transformWeClass = require('unplugin-transform-class/webpack')
const { defaultAttributes, defaultIgnoreNonValuedAttributes, attributifyToClass } = require('unplugin-attributify-to-class/webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      // https://github.com/unocss/unocss
      UnoCSS(),
      // https://github.com/MellowCo/unplugin-attributify-to-class
      attributifyToClass({
        attributes: [...defaultAttributes, 'my-attr'],
        ignoreNonValuedAttributes: [...defaultIgnoreNonValuedAttributes, 'my-ignore'],
        nonValuedAttribute: true,
        prefix: 'li-',
        prefixedOnly: false,
      }),
      // https://github.com/MellowCo/unplugin-transform-class
      transformWeClass(),
    ],
  },
}
