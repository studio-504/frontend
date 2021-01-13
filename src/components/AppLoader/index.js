import React, { useEffect } from 'react'
import LoadingComponent from 'components/Loading'
import { useDispatch } from 'react-redux'
import * as authActions from 'store/ducks/auth/actions'
import * as Updates from 'services/Updates'

const AppLoader = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    Updates.versionCheck()
    dispatch(authActions.authFlowRequest({ allowAnonymous: false }))
  }, [])

  return <LoadingComponent />
}

export default AppLoader
