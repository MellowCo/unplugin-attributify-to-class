import type { FilterPattern } from '@rollup/pluginutils'

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
    * @default [/\.[jt]sx?$/, /\.vue$/,  /\.vue\?vue/]
    */
  include?: FilterPattern
}
