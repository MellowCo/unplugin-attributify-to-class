export const fixture1 = `
<template>
  <view >
    <button
      h-80 text-center flex flex-col align-center select-none all:transition-400
      bg="blue-400 hover:blue-400 dark:!blue-400 dark:hover:blue-400"
      li-bg="blue-500 hover:blue-500 dark:!blue-500 dark:hover:blue-500"
      un-bg="red-500 hover:red-500 dark:!red-500 dark:hover:red-500"
      class="text-red font-bold"
      :loading="loading"
      my-class="text-red font-bold"
      title="this is title"
      my-prop
      non-value
      :class="{ 'text-blue': true, 'text-green': false }"
      :class="[ 'text-blue', 'text-green' ]"
      :class="[ str === 'blue' ? 'text-blue' : 'text-red' ]"
    >
      Button
    </button>

    <button 
      text="sm white"
      font="mono light"
      p="y-2 x-4"
      my-attr="y-1 x-2 sm"
    >
      Button
    </button>

    <button 
      text="sm white"
      font="mono light"
      p="y-2 x-4"
    >
      Button
    </button>

    <button border="~ red">
      Button
    </button>

    <button flex="~ col wrap">
      Button
    </button>

    <a text="red" un-text="blue">This conflicts with links' text prop</a>

    <button 
      bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
      text="sm white"
      font="mono light"
      p="y-2 x-4"
      border="2 rounded blue-200"
    >
      Button
    </button>

    <button 
      bg="#333 grey-200 [#444]/40 red/50"
    >
      Button
    </button>

    <image mode="widthFix"></image> 
  </view>
</template>  
`

export const fixture2 = `
<template>
  <div h-80 text-center flex flex-col align-center select-none all:transition-400>
    <input type="checkbox" peer mt-a>
    <div mb-a group peer-checked="text-4xl">
      <div
        font-100 text-4xl mb--3 p-10
        bg-gradient="to-r from-yellow-400 via-red-500 to-pink-500"
      >
        ~
      </div>
      <div text-5xl font-100 sm="bg-blue-600">
        unocss
      </div>
      <div op-20 font-200 mt-1 tracking-wider group-hover="text-teal-400 op-50">
        Re-imaging Atomic CSS
      </div>
    </div>
  </div>
  <div flex>
    <div ma inline-flex relative h-14>
      <input type="text" m-0 pt-4 px-4 text-true-gray-800 peer 
      placeholder="unocss" 
      un-placeholder="text-red">
      <label absolute leading-1rem left-4 pointer-events-none text-gray-7 top="1/3" transition="200 linear"
        peer-not-placeholder-shown="-translate-y-4 scale-75 origin-top-left text-green-500"
        peer-focus="-translate-y-4 scale-75 origin-top-left text-green-500"
        before="content-!"
        after="content-[!]"
      >Experience now</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss" scoped></style>
`

export const fuiButton = `
<template>
<view class="fui-button__wrap" :class="[!width || width==='100%' || width===true?'fui-button__flex-1':'']" :scope="scope" @tap.stop="handleTap" @click.stop="handleTap" @click="handleTap">
</view>
</template>
`

// 错误: const CheckboxGropup = ref<InstanceType<typeof tmCheckboxGroup class=\\"tmCheckboxGroup\\"> | null>(null)
export const scriptStr = `
<template>
  <view bg="#333" p="x-6 y-10" w100 h200>this is a unocss</view>
</template>

<script lang="ts" setup>
const CheckboxGropup = ref<InstanceType<typeof tmCheckboxGroup> | null>(null)
</script>
`

export const escapeStr = `
<template>
  <button 
  bg="#333 grey-200 [#444]/40 red/50">  
    Button
  </button>
</template>`

export const noTemplateStr = `
<script lang="ts" setup>
const CheckboxGropup = ref<InstanceType<typeof tmCheckboxGroup> | null>(null)
const a = 1
</script>
`

// 错误：[plugin:vite:vue] Duplicate attribute.
// <view class=\\"\\" class=\\"class\\">
export const emptyClassStr = `
<template>
  <view class="" bg-green bg="blue red">
    <tm-skeleton-line :height="props.height*4"></tm-skeleton-line>
  </view>
</template>
`
