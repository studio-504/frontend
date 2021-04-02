import * as constants from 'store/ducks/purchases/constants'

export default {
  /**
   *
   */
  [constants.PURCHASE_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to subscribe',
    },
    E_USER_CANCELLED: {
      code: 'E_USER_CANCELLED',
      text: 'Canceled subscribe',
    },
  },

  /**
   *
   */
  [constants.RETRY_PURCHASE_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to subscribe',
    },
    E_USER_CANCELLED: {
      code: 'E_USER_CANCELLED',
      text: 'Canceled subscribe',
    },
  },
}
