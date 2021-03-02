import * as usersSingle from 'store/ducks/users/queries/single'

export const redeemPromotion = `
  mutation redeemPromotion($code: String!) {
    redeemPromotion(code: $code) {
      ...singleUserFragment
    }
  }
  ${usersSingle.singleUserFragment}
`
