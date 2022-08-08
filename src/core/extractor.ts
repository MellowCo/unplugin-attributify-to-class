import type { Options } from '../types'
import { isValidSelector } from './utils'

const strippedPrefixes = [
  'v-bind:',
  ':',
]

const splitterRE = /[\s'"`;]+/g
const elementRE = /<\w(?=.*>)[\w:\.$-]*\s((?:['"`].*?['"`]|.*?)*?)>/gs
const valuedAttributeRE = /([?]|(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:!%-]+)(?:=(["'])([^\2]*?)\2)?/g
export const defaultAttributes = ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className']

interface TransformOption {
  /**
   * 元素标签
   */
  elementStr: string

  /**
   * 元素标签备份
   */
  tempStr: string

  /**
   * 是否有静态class
   */
  staticClass: string

  /**
   *  Attributify转class选择器
   */
  selectors: string[]
}

export const extractorAttributify = (options?: Options): any => {
  const attributes = options?.attributes ?? defaultAttributes
  const nonValuedAttribute = options?.nonValuedAttribute ?? false
  const ignoreNonValuedAttributes = options?.ignoreNonValuedAttributes ?? []
  const prefix = options?.prefix ?? 'un-'
  const prefixedOnly = options?.prefixedOnly ?? false

  return function extract(code: string) {
    const result: TransformOption[] = []

    Array.from(code.matchAll(elementRE))
      .forEach(([elementStr, valuedAttributeStr]) => {
        const valuedAttributes = Array.from((valuedAttributeStr || '').matchAll(valuedAttributeRE))

        const option: TransformOption = {
          elementStr,
          tempStr: elementStr,
          staticClass: '',
          selectors: [],
        }
        valuedAttributes.forEach(([sourceStr, name, _, content]) => {
          const _name = prefixedOnly ? name.replace(prefix, '') : name

          if (!content) {
            // 处理 transform pt2 rounded-sm 单值属性
            if (isValidSelector(name) && nonValuedAttribute !== false) {
              // 不是忽略的非值属性
              if (!ignoreNonValuedAttributes.includes(name)) {
                option.tempStr = option.tempStr.replace(name, '')
                option.selectors.push(name)
              }
            }
            return
          }

          for (const prefix of strippedPrefixes) {
            // 如果是 : v-bind: 开头的属性，则不处理
            if (name.startsWith(prefix)) {
              name = name.slice(prefix.length)
              return
            }
          }

          // 是否生成该属性
          if (!attributes.includes(_name))
            return

          if (['class', 'className'].includes(name)) {
            option.staticClass = sourceStr
          }
          else {
            if (prefixedOnly && !name.startsWith(prefix))
              return

            // 处理 bg="blue-400 hover:blue-500 dark:!blue-500 dark:hover:blue-600"
            const attributifyToClass = content
              .split(splitterRE)
              .filter(Boolean)
              .map(v => `${_name}-${v}`).join(' ')

            option.tempStr = option.tempStr.replace(sourceStr, '')
            option.selectors.push(attributifyToClass)
          }
        })

        result.push(option)
      })

    result.forEach(({ elementStr, tempStr, staticClass, selectors }) => {
      if (selectors.length === 0)
        return

      if (staticClass) {
        tempStr = tempStr.replace(staticClass, spliceStr(staticClass, -1, ` ${selectors.join(' ')}`))
        code = code.replace(elementStr, tempStr)
      }
      else {
        const className = `class="${selectors.join(' ')}"`
        code = code.replace(elementStr, spliceStr(tempStr, -1, className))
      }
    })

    return code
  }
}

function spliceStr(str: string, start: number, newStr: string) {
  return str.slice(0, start) + newStr + str.slice(start)
}
