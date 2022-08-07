import { describe, expect, test } from 'vitest'
import { extractorAttributify } from '../src/core/extractor'

describe('attributify', () => {
  const fixture1 = `
  <view >
    <button
      h-80 text-center flex flex-col align-center select-none all:transition-400
      bg="blue-400 hover:blue-400 dark:!blue-400 dark:hover:blue-400"
      li-bg="blue-500 hover:blue-500 dark:!blue-500 dark:hover:blue-500"
      class="text-red font-bold"
      :loading="loading"
      my-class="text-red font-bold"
      title="this is title"
      :class="{ 'text-blue': true, 'text-green': false }"
      :class="[ 'text-blue', 'text-green' ]"
      :class="[ str === 'blue' ? 'text-blue' : 'text-red' ]"
    >
      Button
    </button>

    <image mode="widthFix"></image> 
  </view>
`

  const fixture2 = `
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
`

  const extract1 = extractorAttributify()
  const extract2 = extractorAttributify({
    prefixedOnly: true,
    prefix: 'li-',
  })

  test('extract1', async () => {
    expect(extract1(fixture1)).toMatchSnapshot()
    expect(extract1(fixture2)).toMatchSnapshot()
  })

  test('extract2', async () => {
    expect(extract2(fixture1)).toMatchSnapshot()
    expect(extract2(fixture2)).toMatchSnapshot()
  })
})
