export default interface Options {

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
   * @default true
   */
  nonValuedAttribute?: boolean

  /**
   * 需要转换的属性列表
   * @default ['bg', 'flex', 'grid', 'border', 'text', 'font']
   */
  attributes?: string[]
}
