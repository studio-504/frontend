import React, { useEffect } from 'react'
import LoadingComponent from 'components/Loading'
import { useDispatch } from 'react-redux'
import * as appActions from 'store/ducks/appState/actions'

const AppLoader = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(appActions.appStateLaunched())
  }, [])

  return <LoadingComponent />
}

export default AppLoader
