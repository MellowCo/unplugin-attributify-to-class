import type AttributifyOptions from '../types'
import { isValidSelector } from './utils'

const strippedPrefixes = [
  'v-bind:',
  ':',
]

const splitterRE = /[\s'"`;]+/g
const elementRE = /<\w(?=.*>)[\w:\.$-]*\s((?:['"`].*?['"`]|.*?)*?)>/gs
const valuedAttributeRE = /([?]|(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:!%-]+)(?:=(["'])([^\2]*?)\2)?/g
export const defaultIgnoreAttributes = ['placeholder', 'type']

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

export const extractorAttributify = (options?: AttributifyOptions): any => {
  const ignoreAttributes = options?.ignoreAttributes ?? defaultIgnoreAttributes
  const nonValuedAttribute = options?.nonValuedAttribute ?? true

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
          // console.log('elementStr', elementStr)
          // console.log('sourceStr', sourceStr)
          // console.log('name', sourceStr)
          // console.log('_', _)
          // console.log('content', sourceStr)
          // console.log('===================')

          // 是否忽略该属性
          if (ignoreAttributes.includes(name))
            return

          for (const prefix of strippedPrefixes) {
            // 如果是 : v-bind: 开头的属性，则不处理
            if (name.startsWith(prefix)) {
              name = name.slice(prefix.length)
              return
            }
          }

          if (!content) {
            // 处理 transform pt2 rounded-sm 单值属性
            if (isValidSelector(name) && nonValuedAttribute !== false) {
              // 删除属性
              option.tempStr = option.tempStr.replace(name, '')
              option.selectors.push(name)
            }
            return
          }

          if (['class', 'className'].includes(name)) {
            option.staticClass = sourceStr
          }
          else {
            // 处理 bg="blue-400 hover:blue-500 dark:!blue-500 dark:hover:blue-600"
            const attributifyToClass = content
              .split(splitterRE)
              .filter(Boolean)
              .map(v => `${name}-${v}`).join(' ')

            option.tempStr = option.tempStr.replace(sourceStr, '')
            option.selectors.push(attributifyToClass)
          }
        })

        result.push(option)
      })

    result.forEach(({ elementStr, tempStr, staticClass, selectors }) => {
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

export function spliceStr(str: string, start: number, newStr: string) {
  return str.slice(0, start) + newStr + str.slice(start)
}
