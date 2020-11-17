import * as constants from 'store/ducks/app/constants'

const messageCodes = {
  /**
   * 
   */
  [constants.APP_READY_SUCCESS]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'App assets were fetched',
    },
  },
  [constants.APP_READY_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to fetch app assets',
    },
  },
}

export const getMessagePayload = (key, status = 'GENERIC', nativeError = '') => {
  return ({
    ...messageCodes[key][status],
    nativeError,
  })
}