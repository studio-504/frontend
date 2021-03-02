import * as constants from 'store/ducks/promocodes/constants'

export default {
  /**
   *
   */
  [constants.PROMO_CODES_REDEEM_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to redeem promocode',
    },
    NOT_VALID: {
      code: 'NOT_VALID',
      text: 'Promocode is not valid',
    },
    ALREADY_GRANTED: {
      code: 'ALREADY_GRANTED',
      text: 'User has already granted a bonus',
    },
  },
}
