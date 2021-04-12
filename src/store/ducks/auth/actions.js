import { createAction } from 'redux-actions'
import { createFailureAction } from 'store/errors'

import * as constants from 'store/ducks/auth/constants'

/**
 * New auth manager
 */
export const authFlowIdle = createAction(constants.AUTH_FLOW_IDLE)
export const authFlowRequest = createAction(constants.AUTH_FLOW_REQUEST)
export const authFlowSuccess = createAction(constants.AUTH_FLOW_SUCCESS)
export const authFlowFailure = createFailureAction(constants.AUTH_FLOW_FAILURE)

/**
 * Solely for cognito request
 */
export const authTokenIdle = createAction(constants.AUTH_TOKEN_IDLE)
export const authTokenRequest = createAction(constants.AUTH_TOKEN_REQUEST)
export const authTokenSuccess = createAction(constants.AUTH_TOKEN_SUCCESS)
export const authTokenFailure = createFailureAction(constants.AUTH_TOKEN_FAILURE)

/**
 * Clear cached credentials for amplify
 */
export const authResetIdle = createAction(constants.AUTH_RESET_IDLE)
export const authResetRequest = createAction(constants.AUTH_RESET_REQUEST)
export const authResetSuccess = createAction(constants.AUTH_RESET_SUCCESS)
export const authResetFailure = createFailureAction(constants.AUTH_RESET_FAILURE)

/**
 * Solely for cognito request
 */
export const authDataIdle = createAction(constants.AUTH_DATA_IDLE)
export const authDataRequest = createAction(constants.AUTH_DATA_REQUEST)
export const authDataSuccess = createAction(constants.AUTH_DATA_SUCCESS)
export const authDataFailure = createFailureAction(constants.AUTH_DATA_FAILURE)

/**
 * Application Initial data prefetch
 */
export const authPrefetchIdle = createAction(constants.AUTH_PREFETCH_IDLE)
export const authPrefetchRequest = createAction(constants.AUTH_PREFETCH_REQUEST)
export const authPrefetchSuccess = createAction(constants.AUTH_PREFETCH_SUCCESS)
export const authPrefetchFailure = createFailureAction(constants.AUTH_PREFETCH_FAILURE)

/**
 *
 */
export const authSigninCognitoIdle = createAction(constants.AUTH_SIGNIN_COGNITO_IDLE)
export const authSigninCognitoRequest = createAction(constants.AUTH_SIGNIN_COGNITO_REQUEST)
export const authSigninCognitoSuccess = createAction(constants.AUTH_SIGNIN_COGNITO_SUCCESS)
export const authSigninCognitoFailure = createFailureAction(constants.AUTH_SIGNIN_COGNITO_FAILURE)

/**
 *
 */
export const authSigninAnonymousIdle = createAction(constants.AUTH_SIGNIN_ANONYMOUS_IDLE)
export const authSigninAnonymousRequest = createAction(constants.AUTH_SIGNIN_ANONYMOUS_REQUEST)
export const authSigninAnonymousSuccess = createAction(constants.AUTH_SIGNIN_ANONYMOUS_SUCCESS)
export const authSigninAnonymousFailure = createFailureAction(constants.AUTH_SIGNIN_ANONYMOUS_FAILURE)

/**
 *
 */
export const authSigninGoogleIdle = createAction(constants.AUTH_SIGNIN_GOOGLE_IDLE)
export const authSigninGoogleRequest = createAction(constants.AUTH_SIGNIN_GOOGLE_REQUEST)
export const authSigninGoogleSuccess = createAction(constants.AUTH_SIGNIN_GOOGLE_SUCCESS)
export const authSigninGoogleFailure = createFailureAction(constants.AUTH_SIGNIN_GOOGLE_FAILURE)

/**
 *
 */
export const authSigninAppleIdle = createAction(constants.AUTH_SIGNIN_APPLE_IDLE)
export const authSigninAppleRequest = createAction(constants.AUTH_SIGNIN_APPLE_REQUEST)
export const authSigninAppleSuccess = createAction(constants.AUTH_SIGNIN_APPLE_SUCCESS)
export const authSigninAppleFailure = createFailureAction(constants.AUTH_SIGNIN_APPLE_FAILURE)

/**
 *
 */
export const authSignoutIdle = createAction(constants.AUTH_SIGNOUT_IDLE)
export const authSignoutRequest = createAction(constants.AUTH_SIGNOUT_REQUEST)
export const authSignoutSuccess = createAction(constants.AUTH_SIGNOUT_SUCCESS)
export const authSignoutFailure = createFailureAction(constants.AUTH_SIGNOUT_FAILURE)

/**
 *
 */
export const authForgotIdle = createAction(constants.AUTH_FORGOT_IDLE)
export const authForgotRequest = createAction(constants.AUTH_FORGOT_REQUEST)
export const authForgotSuccess = createAction(constants.AUTH_FORGOT_SUCCESS)
export const authForgotFailure = createFailureAction(constants.AUTH_FORGOT_FAILURE)

/**
 *
 */
export const authForgotConfirmIdle = createAction(constants.AUTH_FORGOT_CONFIRM_IDLE)
export const authForgotConfirmRequest = createAction(constants.AUTH_FORGOT_CONFIRM_REQUEST)
export const authForgotConfirmSuccess = createAction(constants.AUTH_FORGOT_CONFIRM_SUCCESS)
export const authForgotConfirmFailure = createFailureAction(constants.AUTH_FORGOT_CONFIRM_FAILURE)

/**
 *
 */
export const authGetUserIdle = createAction(constants.AUTH_GET_USER_IDLE)
export const authGetUserRequest = createAction(constants.AUTH_GET_USER_REQUEST)
export const authGetUserSuccess = createAction(constants.AUTH_GET_USER_SUCCESS)
export const authGetUserFailure = createFailureAction(constants.AUTH_GET_USER_FAILURE)
