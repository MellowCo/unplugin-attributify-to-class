import type AttributifyOptions from '../types'
import { isValidSelector } from './utils'

const strippedPrefixes = [
  'v-bind:',
  ':',
]

const splitterRE = /[\s'"`;]+/g
const elementRE = /<\w(?=.*>)[\w:\.$-]*\s((?:['"`\{].*?['"`\}]|.*?)*?)>/gs
const valuedAttributeRE = /([?]|(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:!%-]+)(?:=(["'])([^\2]*?)\2)?/g
export const defaultIgnoreAttributes = ['placeholder']

export const extractorAttributify = (options?: AttributifyOptions): any => {
  const ignoreAttributes = options?.ignoreAttributes ?? defaultIgnoreAttributes
  const nonValuedAttribute = options?.nonValuedAttribute ?? true

  return function extract(code: string) {
    Array.from(code.matchAll(elementRE))
      .flatMap(match => Array.from((match[1] || '').matchAll(valuedAttributeRE)))
      .forEach(([sourceStr, name, _, content]) => {
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
          if (isValidSelector(name) && nonValuedAttribute !== false)
            code = replaceCode(code, sourceStr, name)
          return
        }

        if (!['class', 'className'].includes(name)) {
          // 处理 bg="blue-400 hover:blue-500 dark:!blue-500 dark:hover:blue-600"
          const attributifyToClass = content
            .split(splitterRE)
            .filter(Boolean)
            .map(v => `${name}-${v}`).join(' ')

          code = replaceCode(code, sourceStr, attributifyToClass)
        }
      })

    return code
  }
}

function replaceCode(code: string, sourceStr: string, attributifyToClass: string) {
  const tranformStr = `class="${attributifyToClass}"`
  return code.replace(sourceStr, tranformStr)
}
