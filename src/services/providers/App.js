import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as appActions from 'store/ducks/app/actions'
import * as appSelectors from 'store/ducks/app/selectors'
import LoadingComponent from 'components/Loading'

/**
 * 
 */
export const AppProvider = ({
  children,
}) => {
  const dispatch = useDispatch()
  const appReady = useSelector(appSelectors.appReady)

  /**
   * Constructor function to fetch: Translations, Themes and Auth data
   */
  useEffect(() => {
    dispatch(appActions.appReadyRequest()) 
  }, [])

  if (appReady.status !== 'success') {
    return <LoadingComponent />
  }

  return children
}