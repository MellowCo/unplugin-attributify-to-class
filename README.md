# unplugin-unocss-attributify-wechat

[![Version](https://img.shields.io/npm/v/unplugin-unocss-attributify-wechat.svg?style=flat-square&logo=npm) 
![Downloads](https://img.shields.io/npm/dm/unplugin-unocss-attributify-wechat.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/unplugin-unocss-attributify-wechat)

Starter template for [unplugin](https://github.com/unjs/unplugin)


[UnoCSS](https://github.com/unocss/unocss) 小程序 Attributify Mode 插件, fork from [@unocss/preset-attributify](https://github.com/unocss/unocss/tree/main/packages/preset-attributify)

相关链接
* [UnoCSS](https://github.com/unocss/unocss) - 即时按需原子CSS引擎
* [unocss-preset-weapp](https://github.com/MellowCo/unocss-preset-weapp) - UnoCSS 微信小程序预设
* [unplugin-transform-we-class](https://github.com/MellowCo/unplugin-transform-we-class) - 小程序原子化 CSS 转换转义类名插件
* [unplugin-unocss-attributify-wechat](https://github.com/MellowCo/unplugin-unocss-attributify-wechat) - 小程序 Attributify Mode 插件
* [unocss-webpack-uniapp2](https://github.com/MellowCo/unocss-webpack-uniapp2#unocss-webpack-uniapp2) - 兼容 UniApp Vue2 App开发插件
* [uni-vue3-starter](https://github.com/MellowCo/uni-vue3-starter) - Uniapp-Vite 模版

`uniapp` `taro` 使用文档，见 [github](https://github.com/MellowCo/unocss-preset-weapp) [掘金](https://juejin.cn/post/7116730180252467236/)


## 原因
使用 `@unocss/preset-attributify` 
```html
<button
  bg="blue-400">
  button
</button>

```
生成后的css
```css
[bg~="blue-400"] {
  --un-bg-opacity: 1;
  background-color: rgba(96,165,250,var(--un-bg-opacity));
}
```

小程序不支持属性选择器 [bg~="blue-400"] ，[微信文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F)   

该插件是将 attributify mode 的属性, 收集起来并添加到 `class` 中

```html
<button
  bg="blue-400">
  button
</button>
```
转换后
```html
<button
  bg="blue-400"
  class="bg-blue-400">
  button
</button>
```


## 安装
```shell
npm i -D unplugin-unocss-attributify-wechat
``` 

vite
```ts
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import transformWeClass from 'unplugin-transform-we-class/vite'
import { defaultAttributes, defaultIgnoreNonValuedAttributes, presetAttributifyWechat } from 'unplugin-unocss-attributify-wechat/vite'

export default defineConfig({
  plugins: [
    // https://github.com/antfu/unocss
    Unocss(),

    // https://github.com/MellowCo/unplugin-unocss-attributify-wechat
    presetAttributifyWechat(options),

    // https://github.com/MellowCo/unplugin-transform-we-class
    transformWeClass(),
  ],
})

```

webpack
```js
const UnoCSS = require('@unocss/webpack').default
const transformWeClass = require('unplugin-transform-we-class/webpack')
const { defaultAttributes, defaultIgnoreNonValuedAttributes, presetAttributifyWechat } = require('unplugin-unocss-attributify-wechat/webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      // https://github.com/unocss/unocss
      UnoCSS(),

      // https://github.com/MellowCo/unplugin-unocss-attributify-wechat
      presetAttributifyWechat(options),

      // https://github.com/MellowCo/unplugin-transform-we-class
      transformWeClass(),
    ],
  },
}
```

## options
```ts
export interface Options {

  /**
   * @default 'un-'
   */
  prefix?: string

  /**
   * 仅匹配前缀属性
   * @default false
   */
  prefixedOnly?: boolean

  /**
   * 支持匹配非值属性
   *
   * For example
   * ```html
   * <div mt-2 />
   * ```
   *
   * @default false
   */
  nonValuedAttribute?: boolean

  /**
   * 需要转换的属性列表
   * @default ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm']
   */
  attributes?: string[]

  /**
   * 忽略的非值属性列表
   * @default ['class']
   */
  ignoreNonValuedAttributes?: string[]

  /**
   * 转换转义字符 [ # $
   * @default true
   */
  transformEscape?: boolean

  /**
   * 自定义转换规则
   * @default
   * {
      '.': '-d-',
      '/': '-s-',
      ':': '-c-',
      '%': '-p-',
      '!': '-e-',
      '#': '-w-',
      '(': '-bl-',
      ')': '-br-',
      '[': '-fl-',
      ']': '-fr-',
      '$': '-r-',
    }
   */
  transformRules?: Record<string, string>

  /**
   * 排除转换目标
   * @default [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
   */
  exclude?: FilterPattern

  /**
    * 需要转换的目标
    * @default [/\.vue$/,  /\.vue\?vue/]
    */
  include?: FilterPattern

  /**
    * 为生成的class选择器添加前缀
    * @default ''
    */
  classPrefix?: string
}
```

## Attributify Mode
相关介绍见 [attributify-mode](https://github.com/unocss/unocss/tree/main/packages/preset-attributify#attributify-mode)   

假设按钮使用原子化css, 当列表变得很长时，阅读和维护就会变得非常困难。

使用 attributify mode ，您可以将实用程序分成多个属性

例如，可以将 text-sm text-white 组合为text="sm white"，而不会重复相同的前缀

```html
<button class="text-sm text-white font-mono font-light p-y-2 p-x-4">
  Button
</button>
```

默认转换的属性列表为 ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm']   
```html
<button 
  text="sm white"
  font="mono light"
  p="y-2 x-4"
  my-attr="y-1 x-2 sm"
>
  Button
</button>
```

```html
<button 
  text="sm white"
  font="mono light"
  p="y-2 x-4"
  my-attr="y-1 x-2 sm"
  class="text-sm text-white font-mono font-light p-y-2 p-x-4" 
>
  Button
</button>
```

使用 `attributes` , 添加新的属性

```ts
import { defaultAttributes, presetAttributifyWechat } from 'unplugin-unocss-attributify-wechat/vite'

presetAttributifyWechat({
  attributes: [...defaultAttributes, 'my-attr']
})
```

```html
<button 
  text="sm white"
  font="mono light"
  p="y-2 x-4"
  my-attr="y-1 x-2 sm"
  class="text-sm text-white font-mono font-light p-y-2 p-x-4 my-attr-y-1 my-attr-x-2 my-attr-sm ">
  Button
</button>
```


### 前缀自参照
对于 `flex`、`grid`、`border` 等具有与前缀相同的实用程序，将提供一个特殊的 `~` 值
```html
<button class="border border-red">
  Button
</button>
```
可以写成
```html
<button border="~ red">
  Button
</button>
```

## Valueless Attributify
```html
<button m-2 rounded text-teal-400 />
```
转换后
```html
<button class="m-2 rounded text-teal-400" />
```
### 注意事项
* Valueless Attributify 默认是关闭的，需要设置 `nonValuedAttribute` 为 `true` 
* **默认提取所有 valueless 属性，可以设置 `ignoreNonValuedAttributes`，排除掉不需要的属性，避免生成多余的 `class`
* `ignoreNonValuedAttributes` 默认值 `['class']`
```html
<button m-2 rounded text-teal-400 my-prop is-top/>
```
转换后，会将 `my-prop` `is-top` 提取到 `class`中
```html
<button 
  m-2 rounded text-teal-400 my-prop is-top
  class="m-2 rounded text-teal-400 my-prop is-top" 
/>
```

配置 `ignoreNonValuedAttributes` 忽略 `my-prop` `is-top`
```ts
import { defaultIgnoreNonValuedAttributes, presetAttributifyWechat } from 'unplugin-unocss-attributify-wechat/vite'

presetAttributifyWechat({
  // 开启 valueless attributify
  nonValuedAttribute: true,
  // 忽略的非值属性列表
  ignoreNonValuedAttributes: [...defaultIgnoreNonValuedAttributes, 'my-prop', 'is-top']
})
```

```html
<button 
  m-2 rounded text-teal-400 my-prop is-top
  class="m-2 rounded text-teal-400" 
/>
```

## Properties Conflicts
如果属性模式的名称与元素或组件的属性冲突，可以针对属性模式添加 `prefix`   
For example
```html
<a 
  text="red" 
  un-text="blue"
>
  This conflicts with links' `text` prop
</a>
```
转换后
```html
<a 
  text="red" 
  un-text="blue" 
  class="text-blue"
>
  This conflicts with links' text prop
</a>
```

```ts
presetAttributifyWechat({
  // 前缀属性默认值`un-`
  prefix: 'un-',
  // 仅匹配前缀属性
  prefixedOnly: true,
})
```

## transformEscape
> 针对 `uniappp vue2` `taro` `webpack插件`， `bg="[#333]"` 编译后变成 `bg-  333`，导致样式无法正常显示
> 将 `bg="[#333]"` 提前转义 `bg="[#333]" => bg--fl--w-333-fr`

* 默认开启，设置 `transformEscape`
* 通过 `transformRules` 设置自定义转换规则


[转换规则](https://github.com/MellowCo/unplugin-transform-we-class)
```ts
presetAttributifyWechat({
  transformEscape: true,
  transformRules: {
    '.': '-d-',
    '/': '-s-',
    ':': '-c-',
    '%': '-p-',
    '!': '-e-',
    '#': '-w-',
    '(': '-bl-',
    ')': '-br-',
    '[': '-fl-',
    ']': '-fr-',
    '$': '-r-',
  }
})
```

## include exclude
> 自定义转换的目标

```ts
presetAttributifyWechat({
  exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]my-folder[\\/]/],
  include: [/\.vue$/, /\.vue\?vue/]
})
```

---
## classPrefix
> 为生成的class选择器添加前缀

```html
<button bg-green bg-red text="center left"></button>

<button 
  bg-green bg-red 
  text="center left" 
  class="li-bg-green li-bg-red li-text-center li-text-left"
></button>
```
* 设置 `classPrefix`，生成的class选择器会加上前缀
```ts
const classPrefixExtract = extractorAttributify({
  nonValuedAttribute: true,
  classPrefix: 'li-',
})
```

```html
<button 
  bg-green bg-red 
  text="center left" 
  class="li-bg-green li-bg-red li-text-center li-text-left"
></button>
```

## 原子化 css 冲突问题
> 例如 [tmui](https://tmui.design/)，自身有一套[原子化 css](https://tmui.design/doc/CSSTool/css.html)，导致与 unocss 冲突

![](https://fastly.jsdelivr.net/gh/MellowCo/image-host/2022/202208311130610.png)


1. unocss.config.ts
>  `unocss` 设置 `prefix`
```ts
export default {
  presets: [
  // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      prefix: 'li-',
    }),
  ]
}
```

2. vite.config.ts 
> `presetAttributifyWechat` 设置 `classPrefix` 
```ts
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // https://github.com/MellowCo/unplugin-unocss-attributify-wechat
    presetAttributifyWechat({
      nonValuedAttribute: true,
      classPrefix: 'li-',
    }),
  ],
})
```

> 这样冲突问题就解决了
```html
<view bg="#333" p="x-6 y-10" w100 h200 class="li-bg-red">
  this is a unocss
</view>
```

![](https://fastly.jsdelivr.net/gh/MellowCo/image-host/2022/202208311149877.png)


[tm-ui-demo](https://github.com/MellowCo/unplugin-unocss-attributify-wechat/tree/master/examples/tm-ui-demo)
