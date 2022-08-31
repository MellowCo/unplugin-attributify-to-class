import presetWeapp from 'unocss-preset-weapp'
export default {
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp({
      prefix: 'li-'
    }),
  ],
  shortcuts: [
    {
      'border-base': 'border border-gray-500_10',
      'center': 'flex justify-center items-center',
    },
  ],
  theme: {
    // v0.1.9 加入动画预设
    // https://github.com/MellowCo/unocss-preset-weapp#animation-v019
    // 设置自定义动画
    animation: {
      keyframes: {
        'my-animation': '{0% {letter-spacing: -0.5em;transform: translateZ(-700px);opacity: 0;}40% {opacity: 0.6;}100% {transform: translateZ(0);opacity: 1;}}',
      },
      durations: {
        'my-animation': '0.8s',
      },
      counts: {
        'my-animation': 'infinite',
      },
      timingFns: {
        'my-animation': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
      },
    },
  },
}
