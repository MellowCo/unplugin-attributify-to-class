<H1 align='center'>
unplugin-attributify-to-class
</H1>


<p align='center'>
<a href="https://github.com/MellowCo/unplugin-attributify-to-class/blob/master/README.md">English</a> | <b>简体中文</b>
</p>

[![Version](https://img.shields.io/npm/v/unplugin-attributify-to-class.svg?style=flat-square&logo=npm) 
![Downloads](https://img.shields.io/npm/dm/unplugin-unocss-attributify-wechat.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/unplugin-attributify-to-class)

将原子化css [attributify mode](https://github.com/unocss/unocss/tree/main/packages/preset-attributify#attributify-mode) 收集并添加到 class 中， 以支持在小程序中使用 attributify mode

为了贴合功能语义，`unplugin-unocss-attributify-wechat` 改名为 `unplugin-attributify-to-class`

---
## 为什么使用
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

---

使用该插件

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

---

## 安装
```shell
npm i -D unplugin-attributify-to-class
```


<details>
<summary>vite</summary><br>

```ts
import { defineConfig } from 'vite'
import { attributifyToClass, defaultAttributes, defaultIgnoreNonValuedAttributes } from 'unplugin-attributify-to-class/vite'

export default defineConfig({
  plugins: [
    // https://github.com/MellowCo/unplugin-attributify-to-class
    attributifyToClass(),
  ],
})
```

<br></details>



<details>
<summary>webpack</summary><br>


```js
const { defaultAttributes, defaultIgnoreNonValuedAttributes, attributifyToClass } = require('unplugin-attributify-to-class/webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      // https://github.com/MellowCo/unplugin-attributify-to-class
      attributifyToClass(),
    ],
  },
}
```

<br></details>


## 如何使用

### options
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
   * 需要转换的属性列表
   * @default ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm', 'animate']
   */
  attributes?: string[]

  /**
   * 忽略的非值属性列表
   * @default ['class']
   */
  ignoreNonValuedAttributes?: string[]

  /**
   * 支持匹配非值属性
   *
   * For example
   * ```html
   * <div mt-2 />
   * ```
   *
   * @default true
   */
  nonValuedAttribute?: boolean

  /**
   * 转换转义字符 [ # $
   * @default true
   */
  transformEscape?: boolean

  /**
   * 自定义转义字符转换规则
   * @default https://github.com/MellowCo/unplugin-transform-class#options
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

### Attributify Mode
相关介绍见 [attributify-mode](https://github.com/unocss/unocss/tree/main/packages/preset-attributify#attributify-mode)   

```html
<button class="text-sm text-white font-mono font-light p-y-2 p-x-4">
  Button
</button>
```

默认转换的属性列表为 ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm', 'animate']   
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
import { attributifyToClass, defaultAttributes } from 'unplugin-attributify-to-class/vite'
// import { attributifyToClass, defaultAttributes } from 'unplugin-attributify-to-class/webpack'

attributifyToClass({
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

### Valueless Attributify
```html
<button m-2 rounded text-teal-400 />
```
转换后
```html
<button 
  m-2 rounded text-teal-400 
  class="m-2 rounded text-teal-400" 
/>
```

注意事项
* Valueless Attributify 默认是 `开启` 的，设置 `nonValuedAttribute` 为 `false` 关闭
* 默认提取所有 valueless 属性，可以设置 `ignoreNonValuedAttributes`，排除掉不需要的属性，避免生成多余的 `class`
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
import { attributifyToClass, defaultIgnoreNonValuedAttributes } from 'unplugin-attributify-to-class/vite'
// import { attributifyToClass, defaultIgnoreNonValuedAttributes } from 'unplugin-attributify-to-class/webpack'

attributifyToClass({
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

### Properties Conflicts
如果属性模式的名称与元素或组件的属性冲突，可以针对属性模式添加 `prefix`   
```html
<a 
  text="red" 
  bg-red
  un-text="blue"
  un-bg-blue
>
  This conflicts with links' `text` prop
</a>
```

设置 前缀匹配

```ts
attributifyToClass({
  // 前缀属性默认值`un-`
  prefix: 'un-',
  // 仅匹配前缀属性
  prefixedOnly: true,
})
```

转换后

```html
<a 
  text="red" 
  bg-red
  un-text="blue"
  un-bg-blue
  class="text-blue bg-blue"
>
  This conflicts with links' text prop
</a>
```


### transformEscape
> 针对 `uniappp vue2` `taro` `webpack插件`， `bg="[#333]"` 编译后变成 `bg-  333`，导致样式无法正常显示
> 将 `bg="[#333]"` 提前转义 `bg="[#333]" => bg--fl--w-333-fr`

* 默认开启，设置 `transformEscape`
* 通过 `transformRules` 设置自定义转换规则，[默认转换规则](https://github.com/MellowCo/unplugin-transform-class)

自定义转换规则
```ts
const myRules = {
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

attributifyToClass({
  transformEscape: true,
  transformRules: myRules
})
```

### include exclude
> 自定义转换的目标

```ts
attributifyToClass({
  exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]my-folder[\\/]/],
  include: [/\.vue$/, /\.vue\?vue/]
})
```

---
### classPrefix
> 为生成的class选择器添加前缀

```html
<button bg-green bg-red text="center left"></button>

<button 
  bg-green bg-red 
  text="center left" 
  class="bg-green bg-red text-center text-left"
></button>
```
* 设置 `classPrefix`，生成的class选择器会加上前缀
```ts
const classPrefixExtract = extractorAttributify({
  nonValuedAttribute: true,
  classPrefix: 'li-',
})
```
转换后，会在生成的 `class` 中，添加前缀，bg-green => class="li-bg-green"

```html
<button 
  bg-green bg-red 
  text="center left" 
  class="li-bg-green li-bg-red li-text-center li-text-left"
></button>
```


---
### utils 导出
```ts
import { extractorAttributify } from 'unplugin-attributify-to-class/utils'
const options = {
  // ...
}

const extractor = extractorAttributify(options)

const code = 'xxxxx'
const newCode = extractor(code)
```


相关链接
* [unocss-preset-weapp](https://github.com/MellowCo/unocss-preset-weapp) - UnoCSS 小程序预设

