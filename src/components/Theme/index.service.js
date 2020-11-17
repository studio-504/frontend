import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as usersActions from 'store/ducks/users/actions'
import * as authSelector from 'store/ducks/auth/selectors'

const ThemeService = ({ children }) => {
  const dispatch = useDispatch()
  const [appThemePreview, setAppThemePreview] = useState(null)
  const user = useSelector(authSelector.authUserSelector)

  const appThemePreviewRequest = (payload) => setAppThemePreview(payload)
  const appThemePreviewIdle = () => setAppThemePreview(null)

  const appThemePreviewUpdate = (themeCode) => {
    dispatch(usersActions.usersEditProfileRequest({ themeCode }))
    appThemePreviewIdle()
  }

  return children({
    user,
    appThemePreview,
    appThemePreviewUpdate,
    appThemePreviewRequest,
    appThemePreviewIdle,
  })
}

export default ThemeService
