import { defaultRules, transformSelector } from 'unplugin-transform-we-class/utils'
import type { Options } from '../types'

const strippedPrefixes = [
  'v-bind:',
  ':',
  '@',
  'v-on',
]

const templateRe = /<template>([\s\S]*)<\/template>/g
const splitterRE = /[\s'"`;]+/g
const elementRE = /<\w(?=.*>)[\w:\.$-]*\s((?:['"`].*?['"`]|.*?)*?)>/gs
const valuedAttributeRE = /([?]|(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:@.!%-]+)(?:=(["'])([^\2]*?)\2)?/g

const validateFilterRE = /(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:%-?]/

function isValidSelector(selector = ''): selector is string {
  return validateFilterRE.test(selector)
}

export const defaultAttributes = ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm']
export const defaultIgnoreNonValuedAttributes = ['class']

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
  const ignoreNonValuedAttributes = options?.ignoreNonValuedAttributes ?? defaultIgnoreNonValuedAttributes
  const prefix = options?.prefix ?? 'un-'
  const prefixedOnly = options?.prefixedOnly ?? false
  const transformEscape = options?.transformEscape ?? true
  const transformRules = options?.transformRules ?? defaultRules

  return function extract(code: string) {
    const result: TransformOption[] = []

    // 只匹配 template 里的代码
    const templateMatchs = Array.from(code.matchAll(templateRe))

    if (templateMatchs.length) {
      const templateCode = templateMatchs[0][1]

      Array.from(templateCode.matchAll(elementRE))
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
              // 处理 class="" ，生成 2 个 class 属性的问题
              if (name === 'class')
                option.staticClass = sourceStr

              // 处理 transform pt2 rounded-sm 单值属性
              if (isValidSelector(name) && nonValuedAttribute !== false) {
              // 不是忽略的非值属性
                if (!ignoreNonValuedAttributes.includes(name)) {
                // option.tempStr = option.tempStr.replace(name, '')
                  option.selectors.push(transformEscape ? transformSelector(name, transformRules) : name)
                }
              }
              return
            }

            for (const prefix of strippedPrefixes) {
            // 如果是 : v-bind @ v-on 开头的属性，则不处理
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

              // 处理 bg="blue-400"
              const attributifyToClass = content
                .split(splitterRE)
                .filter(Boolean)
                .map(v => v === '~' ? _name : `${_name}-${transformEscape ? transformSelector(v, transformRules) : v}`).join(' ')

              // option.tempStr = option.tempStr.replace(sourceStr, '')
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
          const className = ` class="${selectors.join(' ')}"`
          code = code.replace(elementStr, spliceStr(tempStr, -1, className))
        }
      })
    }

    return code
  }
}

function spliceStr(str: string, start: number, newStr: string) {
  return str.slice(0, start) + newStr + str.slice(start)
}
