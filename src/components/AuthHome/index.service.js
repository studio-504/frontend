import { useSelector, useDispatch } from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'
import * as authSelectors from 'store/ducks/auth/selectors'

const AuthHomeComponentService = ({ children }) => {
  const dispatch = useDispatch()
  const authSigninGoogle = useSelector(authSelectors.authSigninGoogle)
  const authSigninApple = useSelector(authSelectors.authSigninApple)
  const authSigninAnonymous = useSelector(authSelectors.authSigninAnonymous)

  const authSigninGoogleRequest = () =>
    dispatch(authActions.authSigninGoogleRequest())

  const authSigninAppleRequest = () =>
    dispatch(authActions.authSigninAppleRequest())

  const authSigninAnonymousRequest = () =>
    dispatch(authActions.authSigninAnonymousRequest())

  const authSigninCognitoIdle = () =>
    dispatch(authActions.authSigninCognitoIdle({}))

  return children({
    authSigninGoogle,
    authSigninGoogleRequest,
    authSigninApple,
    authSigninAppleRequest,
    authSigninCognitoIdle,
    authSigninAnonymous,
    authSigninAnonymousRequest,
  })
}

export default AuthHomeComponentService
