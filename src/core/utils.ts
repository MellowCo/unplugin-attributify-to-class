export const validateFilterRE = /(?!\d|-{2}|-\d)[a-zA-Z0-9\u00A0-\uFFFF-_:%-?]/

export function isValidSelector(selector = ''): selector is string {
  return validateFilterRE.test(selector)
}
