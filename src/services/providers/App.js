import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import * as appActions from 'store/ducks/app/actions'

/**
 * 
 */
export const AppProvider = ({
  children,
}) => {
  const dispatch = useDispatch()

  /**
   * Constructor function to fetch: Translations, Themes and Auth data
   */
  useEffect(() => {
    dispatch(appActions.appReadyRequest())
  }, [])

  return children
}