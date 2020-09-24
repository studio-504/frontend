import * as constants from 'store/ducks/app/constants'

const messageCodes = {
  /**
   * 
   */
  [constants.APP_READY_SUCCESS]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Successfully created anonymous user',
    },
  },
  [constants.APP_READY_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to create anonymous user',
    },
  },

  /**
   * 
   */
  [constants.APP_THEME_SUCCESS]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Successfully created anonymous user',
    },
  },
  [constants.APP_THEME_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to create anonymous user',
    },
  },

  /**
   * 
   */
  [constants.APP_THEME_PREVIEW_SUCCESS]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Successfully created anonymous user',
    },
  },
  [constants.APP_THEME_PREVIEW_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to create anonymous user',
    },
  },

  /**
   * 
   */
  [constants.APP_TRANSLATION_SUCCESS]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Successfully created anonymous user',
    },
  },
  [constants.APP_TRANSLATION_FAILURE]: {
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