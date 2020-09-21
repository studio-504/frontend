import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'
import { useNavigation } from '@react-navigation/native'
import toLower from 'ramda/src/toLower'

const AuthHomeComponentService = ({ children }) => {
  const guessUsernameType = (username) => {
    const hasEmail = /\S+@\S+\.\S+/.test(username)
    const hasPhone = /^[0-9 ()+-]+$/.test(username)

    return (() => {
      if (hasEmail) return 'email'
      if (hasPhone) return 'phone'
      return 'username'
    })()
  }

  const dispatch = useDispatch()
  const navigation = useNavigation()
  const authCheck = useSelector(state => state.auth.authCheck)
  const authSigninGoogle = useSelector(state => state.auth.authSigninGoogle)
  const authSigninApple = useSelector(state => state.auth.authSigninApple)
  const authSigninCognito = useSelector(state => state.auth.authSigninCognito)

  const authSigninGoogleRequest = () => 
    dispatch(authActions.authSigninGoogleRequest())

  const authSigninAppleRequest = () => 
    dispatch(authActions.authSigninAppleRequest())
  
  const authSigninCognitoRequest = (payload) => {
    const usernameType = guessUsernameType(payload.username)
    dispatch(authActions.authSigninCognitoRequest({
      usernameType,
      username: toLower(payload.username),
      password: payload.password,
    }))
  }
  
  const authSigninCognitoIdle = () => 
    dispatch(authActions.authSigninCognitoIdle({}))

  useEffect(() => {
    if (authSigninGoogle.status === 'success') {
      dispatch(authActions.authCheckIdle({}))
      dispatch(authActions.authCheckRequest(authSigninGoogle.data))
      dispatch(authActions.authSigninGoogleIdle({}))
      dispatch(authActions.authSigninCognitoIdle({}))
    }
  }, [
    authSigninGoogle.status,
  ])

  useEffect(() => {
    if (authSigninApple.status === 'success') {
      dispatch(authActions.authCheckIdle({}))
      dispatch(authActions.authCheckRequest(authSigninApple.data))
      dispatch(authActions.authSigninAppleIdle({}))
      dispatch(authActions.authSigninCognitoIdle({}))
    }
  }, [
    authSigninApple.status,
  ])
  
  useEffect(() => {
    if (authSigninCognito.status === 'success') {
      dispatch(authActions.authCheckRequest())
      dispatch(authActions.authSigninCognitoIdle({}))
    }

    if (authSigninCognito.status === 'failure' && authSigninCognito.nextRoute) {
      navigation.navigate(authSigninCognito.nextRoute)
      dispatch(authActions.authSigninCognitoIdle({}))
    }
  }, [
    authSigninCognito.status,
  ])

  useEffect(() => {
    const shouldRedirect = [
      'AuthHome',
      'AuthCognito',
      'AuthSignupConfirm',
    ].includes(authCheck.nextRoute)
    if (shouldRedirect) {
      navigation.navigate(authCheck.nextRoute)
    }
  }, [
    authCheck.nextRoute,
  ])

  return children({
    authCheck,
    authSigninGoogle,
    authSigninGoogleRequest,
    authSigninApple,
    authSigninAppleRequest,
    authSigninCognito,
    authSigninCognitoRequest,
    authSigninCognitoIdle,
  })
}

export default AuthHomeComponentService
