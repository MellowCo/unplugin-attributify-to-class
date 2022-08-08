# unplugin-unocss-attributify-wechat

[![NPM version](https://img.shields.io/npm/v/unplugin-unocss-attributify-wechat?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-unocss-attributify-wechat)

> Starter template for [unplugin](https://github.com/unjs/unplugin).   
> [UnoCSS](https://github.com/unocss/unocss) 小程序 Attributify Mode 插件, fork from [@unocss/preset-attributify](https://github.com/unocss/unocss/tree/main/packages/preset-attributify)

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
import presetAttributifyWechat from 'unplugin-unocss-attributify-wechat/vite'

export default defineConfig({
  plugins: [
    // https://github.com/MellowCo/unplugin-unocss-attributify-wechat
    presetAttributifyWechat(options),

    // https://github.com/antfu/unocss
    Unocss(),

    // https://github.com/MellowCo/unplugin-transform-we-class
    transformWeClass(),
  ],
})

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
   * @default []
   */
  ignoreNonValuedAttributes?: string[]
}
```

## Attributify Mode
相关介绍见 [attributify-mode](https://github.com/unocss/unocss/tree/main/packages/preset-attributify#attributify-mode)   

假设你有这个按钮使用原子化css。当列表变得很长时，阅读和维护就会变得非常困难。

使用 attributify mode ，您可以将实用程序分成多个属性

例如，可以将 text-sm text-white 组合为text="sm white"，而不会重复相同的前缀

```html
<button class="text-sm text-white font-mono font-light p-y-2 p-x-4">
  Button
</button>
```

默认转换的属性列表为 ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm']   

使用 `attributes` , 添加新的属性
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
转换后
```html
<button class="text-sm text-white font-mono font-light p-y-2 p-x-4" my-attr="y-1 x-2 sm">
  Button
</button>
```
添加 `attributes` 后
```html
<button class="my-attr-y-1 my-attr-x-2 my-attr-sm text-sm text-white font-mono font-light p-y-2 p-x-4">
  Button
</button>
```

```ts
import presetAttributifyWechat, { defaultAttributes } from 'unplugin-unocss-attributify-wechat/vite'

presetAttributifyWechat({
  attributes: [...defaultAttributes, 'my-attr']
})
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
* **会提取所有 valueless 属性，需要设置 `ignoreNonValuedAttributes`，排除掉不需要的属性，避免被转换成 `class`**
```html
<button m-2 rounded text-teal-400 my-prop is-top/>
```
转换后
```html
<button class="m-2 rounded text-teal-400 my-prop is-top" />
```

配置 `ignoreNonValuedAttributes` 后
```html
<button class="m-2 rounded text-teal-400" my-prop is-top/>
```

```ts
import presetAttributifyWechat, { defaultAttributes } from 'unplugin-unocss-attributify-wechat/vite'

presetAttributifyWechat({
  // 开启 valueless attributify
  nonValuedAttribute: true,
  // 忽略的非值属性列表
  ignoreNonValuedAttributes: ['my-prop', 'is-top']
})
```

## Properties Conflicts
如果属性模式的名称与元素或组件的属性冲突，可以针对属性模式添加 `prefix`   
For example
```html
<a text="red" un-text="blue">This conflicts with links' `text` prop</a>
```
转换后
```html
<a text="red" class="text-blue">This conflicts with links' text prop</a>
```

```ts
presetAttributifyWechat({
  // 前缀属性默认值`un-`
  prefix: 'un-',
  // 仅匹配前缀属性
  prefixedOnly: true,
})
```
