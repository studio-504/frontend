import * as usersSingle from 'store/ducks/users/queries/single'

export const setThemeCode = `
  mutation setThemeCode($themeCode: String!) {
    setThemeCode(themeCode: $themeCode) {
      ...singleUserFragment
    }
  }
  ${usersSingle.singleUserFragment}
`
