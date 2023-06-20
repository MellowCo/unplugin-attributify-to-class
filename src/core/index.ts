import { defaultRules, transformSelector } from 'unplugin-transform-class/utils'
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
const valuedAttributeRE = /([?]|(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-\[\]#_:@.!%-]+)(?:=(["'])([^\2]*?)\2)?/g

const validateFilterRE = /(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:%-?]/

function isValidSelector(selector = ''): selector is string {
  return validateFilterRE.test(selector)
}

export const defaultAttributes = ['bg', 'flex', 'grid', 'border', 'text', 'font', 'class', 'className', 'p', 'm', 'animate']
export const defaultIgnoreNonValuedAttributes = ['class']

interface TransformOption {
  /**
   * 元素标签
   */
  elementStr: string

  /**
   * 静态class
   */
  staticClass: string

  /**
   *  Attributify转class选择器
   */
  selectors: string[]
}

export function extractorAttributify(options?: Options): any {
  const attributes = options?.attributes ?? defaultAttributes
  const nonValuedAttribute = options?.nonValuedAttribute ?? true
  const ignoreNonValuedAttributes = options?.ignoreNonValuedAttributes ?? defaultIgnoreNonValuedAttributes
  const prefix = options?.prefix ?? 'un-'
  const prefixedOnly = options?.prefixedOnly ?? false
  const transformEscape = options?.transformEscape ?? true
  const transformRules = options?.transformRules ?? defaultRules
  const classPrefix = options?.classPrefix ?? ''

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
            staticClass: '',
            selectors: [],
          }

          valuedAttributes.forEach(([sourceStr, name, _, content]) => {
            const _name = prefixedOnly ? name.replace(prefix, '') : name

            if (!content) {
              // fix: class="" ，生成 2 个 class 属性的问题
              if (name === 'class')
                option.staticClass = sourceStr

              // 是否只匹配 prefix
              if (prefixedOnly && !name.startsWith(prefix))
                return

              // 获取单值属性 <view p-2 m-2 />
              if (isValidSelector(_name) && nonValuedAttribute !== false) {
                // 是否为忽略的单值属性
                if (!ignoreNonValuedAttributes.includes(_name))
                  option.selectors.push(transformEscape ? transformSelector(`${classPrefix}${_name}`, transformRules) : `${classPrefix}${_name}`)
              }
              return
            }

            // : v-bind @ v-on 开头的属性 不处理
            for (const prefix of strippedPrefixes) {
              if (name.startsWith(prefix)) {
                name = name.slice(prefix.length)
                return
              }
            }

            // 是否生成该属性
            if (!attributes.includes(_name))
              return

            // 是否存在静态class
            if (['class', 'className'].includes(name)) {
              option.staticClass = sourceStr
            }
            else {
              // 是否只匹配 prefix
              if (prefixedOnly && !name.startsWith(prefix))
                return

              // 生成 class 选择器
              // bg="blue-400" => bg-blue-400
              const attributifyToClass = content
                .split(splitterRE)
                .filter(Boolean)
                .map((v) => {
                  if (v === '~')
                    return `${classPrefix}${_name}`

                  // support bg="active:red-400" => class="active:bg-red-400"
                  if (v.includes(':')) {
                    const [pseudoPrefix, pseudoValue] = v.split(':')
                    const classStr = `${pseudoPrefix}:${classPrefix}${_name}-${pseudoValue}`
                    return `${transformEscape ? transformSelector(classStr, transformRules) : classStr}`
                  }

                  return `${classPrefix}${_name}-${transformEscape ? transformSelector(v, transformRules) : v}`
                }).join(' ')

              option.selectors.push(attributifyToClass)
            }
          })

          result.push(option)
        })

      result.forEach(({ elementStr, staticClass, selectors }) => {
        if (selectors.length === 0)
          return

        if (staticClass) {
          const replaceStr = elementStr.replace(staticClass, spliceStr(staticClass, -1, ` ${selectors.join(' ')}`))
          code = code.replace(elementStr, replaceStr)
        }
        else {
          const classStr = ` class="${selectors.join(' ')}"`
          // fix: 自闭合标签 插入位置
          const insertIndex = elementStr.endsWith('/>') ? -2 : -1

          code = code.replace(elementStr, spliceStr(elementStr, insertIndex, classStr))
        }
      })
    }

    return code
  }
}

function spliceStr(str: string, start: number, newStr: string) {
  return str.slice(0, start) + newStr + str.slice(start)
}
