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
   * @default ['setup', 'scoped']
   */
  ignoreNonValuedAttributes?: string[]

  /**
   * 转换转义字符 [ # $
   * @default true
   */
  transfromEscape?: boolean
}
