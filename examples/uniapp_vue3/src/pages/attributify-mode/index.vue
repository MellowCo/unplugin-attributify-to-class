<script>
export default {
  setup() {
    return {}
  },
}
</script>

<template>
  <view>
    <button
      text="sm green"
      p="y-2 x-4"
      m="4"
      my-attr="y-1 x-2 sm"
    >
      Button
    </button>

    <button
      text-base text-blue
      py-2 px-4
      m-4
      @click.stop="() => { console.log(11) }"
    >
      Button
    </button>

    <button
      li-text="sm green"
      li-p="y-2 x-4"
      li-m="4"
      li-my-attr="y-1 x-2 sm"
    >
      Button
    </button>

    <button border="~ red" m="4">
      Button
    </button>

    <button flex="~ col wrap" class="m4">
      Button
    </button>

    <text text="red" li-text="blue">
      This conflicts with links' text prop
    </text>

    <view bg="#999">
      111
    </view>

    <view bg="[#9b59b6]/50">
      222
    </view>

    <view bg="#2ecc71:50">
      333
    </view>

    <div
      li-color="yellow" li-w="100px" li-h="100px" li-rd="50"
      li-inline-bold li-bg-pink li-text="3xl" li-font="bold"
    >
      123
    </div>
  </view>
</template>

<style lang="scss" scoped>

</style>
