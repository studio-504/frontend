import * as constants from 'store/ducks/app/constants'

const messageCodes = {
  /**
   * 
   */
  [constants.AUTH_READY_SUCCESS]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Successfully created anonymous user',
    },
  },
  [constants.AUTH_READY_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to create anonymous user',
    },
  },
}

export const getMessagePayload = (key, status = 'GENERIC', nativeError = '') => {
  return ({
    ...messageCodes[key][status],
    nativeError,
  })
}