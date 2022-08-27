export const fuiButton = `
<template>
<view class="fui-button__wrap" :class="[!width || width==='100%' || width===true?'fui-button__flex-1':'']" :scope="scope" @tap.stop="handleTap" @click.stop="handleTap" @click="handleTap">
</view>
</template>
`

