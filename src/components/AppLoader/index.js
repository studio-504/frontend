import React, { useEffect } from 'react'
import LoadingComponent from 'components/Loading'
import { useDispatch } from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'
import * as updatesActions from 'store/ducks/updates/actions'

const AppLoader = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updatesActions.updatesCheckRequest())
    dispatch(authActions.authFlowRequest({ allowAnonymous: false }))
  }, [])

  return <LoadingComponent />
}

export default AppLoader
