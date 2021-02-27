import * as constants from 'store/ducks/contacts/constants'

export default {
  /**
   *
   */
  [constants.CONTACTS_GRANT_BONUS_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to grant bonus',
    },
  },
  [constants.CONTACTS_CHECK_BONUS_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to check bonus',
    },
  },
}
