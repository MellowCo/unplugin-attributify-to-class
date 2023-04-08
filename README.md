<H1 align='center'>
unplugin-attributify-to-class
</H1>

<p align='center'>
<b>English</b> | <a href="https://github.com/MellowCo/unplugin-attributify-to-class/blob/master/README.zh-CN.md">简体中文</a>
</p>

[![Version](https://img.shields.io/npm/v/unplugin-attributify-to-class.svg?style=flat-square&logo=npm) 
![Downloads](https://img.shields.io/npm/dm/unplugin-attributify-to-class.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/unplugin-attributify-to-class)


collect and add atomized css [attributify mode](https://github.com/unocss/unocss/tree/main/packages/preset-attributify#attributify-mode) to class , support the use of attributify mode in miniprogram

to fit the functional semantics，`unplugin-unocss-attributify-wechat` rename to `unplugin-attributify-to-class`


---

## Why use it

use `@unocss/preset-attributify` 
```html
<button
  bg="blue-400">
  button
</button>
```

generated css


```css
[bg~="blue-400"] {
  --un-bg-opacity: 1;
  background-color: rgba(96,165,250,var(--un-bg-opacity));
}
```

miniprogram does not support property selectors [bg~="blue-400"] ，[wechat documents](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F)   

---

use this plugin

```html
<button
  bg="blue-400">
  button
</button>
```
transform

```html
<button
  bg="blue-400"
  class="bg-blue-400">
  button
</button>
```

---

## Installation
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


## Usage

### Options
```ts
export interface Options {

  /**
   * @default 'un-'
   */
  prefix?: string

  /**
   * Only match for prefixed attributes
   * @default false
   */
  prefixedOnly?: boolean

  /**
   * A list of attributes to transform class
   * @default ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm', 'animate']
   */
  attributes?: string[]

  /**
   * A list of non-valued attributes to be ignored from extracting
   * @default ['class']
   */
  ignoreNonValuedAttributes?: string[]

  /**
   * Support matching non-valued attributes
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
   * Transform escape char like [ # $ . ,
   * @default true
   */
  transformEscape?: boolean

  /**
   * Custom transform Rules for escape char
   * @default https://github.com/MellowCo/unplugin-transform-class#options
   */
  transformRules?: Record<string, string>

  /**
   * Rules to exclude transforming target
   * @default [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
   */
  exclude?: FilterPattern

  /**
    * Rules to include transforming target
    * @default [/\.vue$/,  /\.vue\?vue/]
    */
  include?: FilterPattern

  /**
    * Add prefix for class
    * @default ''
    */
  classPrefix?: string
}
```

### Attributify Mode
See [attributify-mode](https://github.com/unocss/unocss/tree/main/packages/preset-attributify#attributify-mode)   
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
Default transfrom attributes list ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm', 'animate'] 

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

Add new `attributes`, like `my-attr`

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


### Prefix Self-referencing
For utilities like flex, grid, border, that have the utilities same as the prefix, a special ~ value is provided.

```html
<button class="border border-red">
  Button
</button>
```
Can be written as
```html
<button border="~ red">
  Button
</button>
```

### Valueless Attributify
```html
<button m-2 rounded text-teal-400 />
```
It will be add class after transform 
```html
<button 
  m-2 rounded text-teal-400
  class="m-2 rounded text-teal-400" 
/>
```

Notice
* Valueless Attributify default value is `true`
* Extract all valueless attributes by default，you can use `ignoreNonValuedAttributes`，exclude unnecessary attributes to avoid generating redundant class
* `ignoreNonValuedAttributes` default value is `['class']`


```html
<button m-2 rounded text-teal-400 my-prop is-top/>
```
After transform ，`my-prop` and  `is-top` will be add to class

```html
<button 
  m-2 rounded text-teal-400 my-prop is-top
  class="m-2 rounded text-teal-400 my-prop is-top" 
/>
```

Setting  `ignoreNonValuedAttributes` to ignore `my-prop` `is-top`
```ts
import { attributifyToClass, defaultIgnoreNonValuedAttributes } from 'unplugin-attributify-to-class/vite'
// import { attributifyToClass, defaultIgnoreNonValuedAttributes } from 'unplugin-attributify-to-class/webpack'

attributifyToClass({
  // open valueless attributify
  nonValuedAttribute: true,
  // ignore non-valued attributes
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
If the name of the attributes mode ever conflicts with the elements' or components' properties, you can add `un-` prefix to be specific to attributify mode.  

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

Setting

```ts
attributifyToClass({
  prefix: 'un-',
  prefixedOnly: true,
})
```

Transform

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


### TransformEscape
> Because `uniappp vue2` `taro` `webpack plugin`， `bg="[#333]"` compile as `bg-  333`, the style cannot be displayed normally
> so transform escape char for bg="[#333]", `bg="[#333]" => bg--fl--w-333-fr`

* Default open，setting with  `transformEscape`
* You can setting custom rules with `transfromRules`, [default transformRules](https://github.com/MellowCo/unplugin-transform-class)

custom transfrom rules
```ts
const myRules = {
  '.': '-dxxx-',
  '/': '-sxxx-',
  ':': '-cxxx-',
  '%': '-pxxx-',
  '!': '-exxx-',
  '#': '-wxxx-',
  '(': '-blxxx-',
  ')': '-brxxx-',
  '[': '-flxxx-',
  ']': '-frxxx-',
  '$': '-rxxx-',
}

attributifyToClass({
  transformEscape: true,
  transformRules: myRules
})
```

### Include exclude
```ts
attributifyToClass({
  exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]my-folder[\\/]/],
  include: [/\.vue$/, /\.vue\?vue/]
})
```

---
### classPrefix
> Add prefix for class 

```html
<button bg-green bg-red text="center left"></button>

<button 
  bg-green bg-red 
  text="center left" 
  class="bg-green bg-red text-center text-left"
></button>
```

Setting classPrefix with `li-`

```ts
attributifyToClass({
  nonValuedAttribute: true,
  classPrefix: 'li-',
})
```
After transform , bg-green => class="li-bg-green"
```html
<button 
  bg-green bg-red 
  text="center left" 
  class="li-bg-green li-bg-red li-text-center li-text-left"
></button>
```

related links
* [unocss-preset-weapp](https://github.com/MellowCo/unocss-preset-weapp) - Uthe unocss preset for wechat miniprogram.

---
### utils
```ts
import { extractorAttributify } from 'unplugin-attributify-to-class/utils'
const options = {
  // ...
}

const extractor = extractorAttributify(options)

const code = 'xxxxx'
const newCode = extractor(code)
```
