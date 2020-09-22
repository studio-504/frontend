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
  const authFlow = useSelector(state => state.auth.authFlow)
  const authSigninGoogle = useSelector(state => state.auth.authSigninGoogle)
  const authSigninApple = useSelector(state => state.auth.authSigninApple)
  const authSigninCognito = useSelector(state => state.auth.authSigninCognito)
  const authSigninAnonymous = useSelector(state => state.auth.authSigninAnonymous)

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

  const authSigninAnonymousRequest = () => 
    dispatch(authActions.authSigninAnonymousRequest())

  const authSigninCognitoIdle = () => 
    dispatch(authActions.authSigninCognitoIdle({}))

  useEffect(() => {
    const shouldRedirect = [
      'AuthHome',
      'AuthCognito',
      'AuthSignupConfirm',
    ].includes(authFlow.meta.nextRoute)
    if (shouldRedirect) {
      navigation.navigate(authFlow.meta.nextRoute)
    }
  }, [
    authFlow.meta.nextRoute,
  ])

  return children({
    authSigninGoogle,
    authSigninGoogleRequest,
    authSigninApple,
    authSigninAppleRequest,
    authSigninCognito,
    authSigninCognitoRequest,
    authSigninCognitoIdle,
    authSigninAnonymous,
    authSigninAnonymousRequest,
  })
}

export default AuthHomeComponentService
