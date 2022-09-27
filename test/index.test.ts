import { describe, expect, test } from 'vitest'
import { defaultAttributes, defaultIgnoreNonValuedAttributes, extractorAttributify } from '../src/core'
import { IllegalStr, classPrefixStr, emptyClassStr, escapeStr, fixture1, fixture2, fuiButton, noTemplateStr, scriptStr } from './assets'

describe('attributify', () => {
  const attributesExtract = extractorAttributify({
    attributes: [
      ...defaultAttributes,
      'my-attr',
    ],
    nonValuedAttribute: false
  })

  // 自定义前缀匹配
  const prefixExtract = extractorAttributify({
    prefixedOnly: true,
    prefix: 'un-',
    nonValuedAttribute: false
  })

  // 忽略单值匹配
  const ignoreNonValueExtract = extractorAttributify({
    nonValuedAttribute: true,
    ignoreNonValuedAttributes: ['h-80', 'flex', 'my-prop'],
  })

  // 单值匹配
  const nonValueExtract = extractorAttributify({
    nonValuedAttribute: true,
  })

  // 完整配置
  const completeExtract = extractorAttributify({
    attributes: [...defaultAttributes, 'my-attr'],
    ignoreNonValuedAttributes: [...defaultIgnoreNonValuedAttributes, 'my-ignore'],
    nonValuedAttribute: true,
    prefix: 'li-',
    prefixedOnly: true,
  })

  // 指定转换规则
  const customRulesextract = extractorAttributify({
    transformRules: {
      '.': '-dr-',
      '/': '-sr-',
      ':': '-cr-',
      '%': '-pr-',
      '!': '-er-',
      '#': '-wr-',
      '(': '-blr-',
      ')': '-brr-',
      '[': '-flr-',
      ']': '-frr-',
      '$': '-rr-',
    },
  })

  const classPrefixExtract = extractorAttributify({
    nonValuedAttribute: true,
    classPrefix: 'li-',
  })

  test('attributesExtract', async () => {
    expect(attributesExtract(fixture1)).toMatchSnapshot()
    expect(attributesExtract(fixture2)).toMatchSnapshot()
  })

  test('prefixExtract', async () => {
    expect(prefixExtract(fixture1)).toMatchSnapshot()
    expect(prefixExtract(fixture2)).toMatchSnapshot()
  })

  test('ignoreNonValueExtract', async () => {
    expect(ignoreNonValueExtract(fixture1)).toMatchSnapshot()
    expect(ignoreNonValueExtract(fixture2)).toMatchSnapshot()
  })

  test('nonValueExtract', async () => {
    expect(nonValueExtract(fixture1)).toMatchSnapshot()
    expect(nonValueExtract(fixture2)).toMatchSnapshot()
  })

  test('completeExtract', async () => {
    expect(completeExtract(fuiButton)).toMatchSnapshot()
  })

  test('escapeStr', () => {
    expect(attributesExtract(escapeStr)).toMatchSnapshot()
    expect(customRulesextract(escapeStr)).toMatchSnapshot()
  })

  test('scriptStr', () => {
    expect(nonValueExtract(scriptStr)).toMatchSnapshot()
    expect(nonValueExtract(noTemplateStr)).toMatchSnapshot()
  })

  test('emptyClassStr', () => {
    expect(nonValueExtract(emptyClassStr)).toMatchSnapshot()
  })

  test('IllegalStr', () => {
    expect(nonValueExtract(IllegalStr)).toMatchSnapshot()
  })

  test('classPrefixExtract', () => {
    expect(classPrefixExtract(classPrefixStr)).toMatchSnapshot()
  })
})
