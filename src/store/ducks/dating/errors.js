import * as constants from 'store/ducks/dating/constants'

export default {
  [constants.DATING_MATCHED_USERS_SUCCESS]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Successfully fetched matched users',
    },
  },
  [constants.DATING_MATCHED_USERS_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to fetch matched users',
    },
  },

  [constants.DATING_CONFIRMED_USERS_SUCCESS]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Successfully fetched matched users',
    },
  },
  [constants.DATING_CONFIRMED_USERS_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to fetch matched users',
    },
  },
}
