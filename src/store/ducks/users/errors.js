import propOr from 'ramda/src/propOr'
import * as constants from 'store/ducks/users/constants'

const messageCodes = {
  /**
   *
   */
  [constants.USERS_EDIT_PROFILE_SUCCESS]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Successfully updated profile',
    },
  },
  [constants.USERS_EDIT_PROFILE_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Failed to update profile',
    },
    VERIFICATION_FAILED: {
      code: 'VERIFICATION_FAILED',
      text: 'Verification failed. Please add an unmodified profile picture. Our AI detects photoshop and filters',
    },
  },
  [constants.USERS_DELETE_AVATAR_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Profile photo delete failed. Please try again',
    },
  },
  [constants.USERS_CHANGE_AVATAR_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Profile photo change failed. Please try again',
    },
  },
  [constants.USERS_SET_USER_DATING_STATUS_FAILURE]: {
    GENERIC: {
      code: 'GENERIC',
      text: 'Unable to enable dating',
    },
    MISSING_FULL_NAME: {
      code: 'MISSING_FULL_NAME',
      text: 'Fullname is missing',
    },
    MISSING_PHOTO_POST_ID: {
      code: 'MISSING_PHOTO_POST_ID',
      text: 'Please upload a profile photo',
    },
    MISSING_AGE: {
      code: 'MISSING_AGE',
      text: 'Age is missing',
    },
    MISSING_GENDER: {
      code: 'MISSING_GENDER',
      text: 'Gender is missing',
    },
    MISSING_LOCATION: {
      code: 'MISSING_LOCATION',
      text: 'Location is missing',
    },
    MISSING_HEIGHT: {
      code: 'MISSING_HEIGHT',
      text: 'Height is missing',
    },
    MISSING_MATCH_AGE_RANGE: {
      code: 'MISSING_MATCH_AGE_RANGE',
      text: 'Match age is missing',
    },
    MISSING_MATCH_GENDERS: {
      code: 'MISSING_MATCH_GENDERS',
      text: 'Match gender is missing',
    },
    MISSING_MATCH_HEIGHT_RANGE: {
      code: 'MISSING_MATCH_HEIGHT_RANGE',
      text: 'Match height is missing',
    },
    MISSING_MATCH_LOCATION_RADIUS: {
      code: 'MISSING_MATCH_LOCATION_RADIUS',
      text: 'Match location radius is missing',
    },
    WRONG_AGE_MIN: {
      code: 'WRONG_AGE_MIN',
      text: 'Invalid min age',
    },
    WRONG_AGE_MAX: {
      code: 'WRONG_AGE_MAX',
      text: 'Invalid max age',
    },
    WRONG_THREE_HOUR_PERIOD: {
      code: 'WRONG_THREE_HOUR_PERIOD',
      text: 'You can only enable dating once per day',
    },
  },
}

const getListOf = propOr([])

export const getGraphqlErrorMessage = (key, graphqlError) => {
  for (let error of getListOf('errors', graphqlError)) {
    for (let errorCode of getListOf('errorInfo', error)) {
      if (typeof errorCode === 'string') {
        const message = getMessagePayload(key, errorCode)
        const isValidMessage = message.code && message.text

        if (isValidMessage) {
          return message
        }
      }
    }
  }

  return getMessagePayload(key, 'GENERIC')
}

export const getMessagePayload = (key, status = 'GENERIC', nativeError = '') => {
  return {
    ...messageCodes[key][status],
    nativeError,
  }
}
