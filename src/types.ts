import type { FilterPattern } from '@rollup/pluginutils'

export interface Options {

  /**
   * @default 'un-'
   */
  prefix?: string

  /**
   * 仅匹配前缀属性
   * Only match for prefixed attributes
   *
   * @default false
   */
  prefixedOnly?: boolean

  /**
   * 支持匹配非值属性
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
   * 需要转换的属性列表
   * A list of attributes to transform class
   *
   * @default ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm', 'animate']
   */
  attributes?: string[]

  /**
   * 忽略的非值属性列表
   * A list of non-valued attributes to be ignored from extracting
   *
   * @default ['class']
   */
  ignoreNonValuedAttributes?: string[]

  /**
   * 转换转义字符 [ # $
   * Transform escape char like [ # $ . ,
   *
   * @default true
   */
  transformEscape?: boolean

  /**
   * 自定义转换规则
   * Custom transform Rules for escape char
   *
   * @default https://github.com/MellowCo/unplugin-transform-class#options
   */
  transformRules?: Record<string, string>

  /**
   * 排除转换目标
   * Rules to exclude transforming target
   *
   * @default [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
   */
  exclude?: FilterPattern

  /**
    * 需要转换的目标
    * Rules to include transforming target
    *
    * @default [/\.vue$/,  /\.vue\?vue/]
    */
  include?: FilterPattern

  /**
    * 为生成的class选择器添加前缀
    * Add prefix for class
    *
    * @default ''
    */
  classPrefix?: string
}
