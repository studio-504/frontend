import { appleAuth } from '@invertase/react-native-apple-authentication'
import jwt from 'jwt-decode'
import pathOr from 'ramda/src/pathOr'
import { AppleCredentialsError } from 'store/errors'


/**
 * Generate expiry time which is 50 mins
 */
const generateTokenExpiry = () => Math.floor(Date.now() / 1000 + 60 * 1000 * 50)

export const getFullname = payload => {
  const familyName = pathOr('', ['fullName', 'familyName'], payload)
  const givenName = pathOr('', ['fullName', 'givenName'], payload)

  return [givenName, familyName].filter(i => Boolean(i)).join(' ')
}

export const signin = async () => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  })

  // get current authentication state for user
  // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)

  // use credentialState response to ensure the user is authenticated
  if (credentialState !== appleAuth.State.AUTHORIZED) {
    throw new AppleCredentialsError('Invalid apple signin credentials state')
  }

  const payload = jwt(appleAuthRequestResponse.identityToken)

  return {
    token: appleAuthRequestResponse.identityToken,
    expires_at: generateTokenExpiry(),
    user: {
      id: appleAuthRequestResponse.user,
      email: payload.email,
      fullName: getFullname(appleAuthRequestResponse),
    },
  }
}

export const refresh = async () => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.REFRESH,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  })

  // get current authentication state for user
  // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)

  // use credentialState response to ensure the user is authenticated
  if (credentialState !== appleAuth.State.AUTHORIZED) {
    throw new AppleCredentialsError('Invalid apple signin credentials state')
  }

  const payload = jwt(appleAuthRequestResponse.identityToken)

  return {
    token: appleAuthRequestResponse.identityToken,
    expires_at: generateTokenExpiry(),
    user: {
      id: appleAuthRequestResponse.user,
      email: payload.email,
    },
  }
}

export const signout = async () => {
  await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGOUT,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  })
}