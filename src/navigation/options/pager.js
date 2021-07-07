import React, { useContext } from 'react'
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter'
import path from 'ramda/src/path'
import { AuthContext } from 'services/providers/Auth'
import { useSelector } from 'react-redux'

const AppViewPagerAdapter = (props) => {
  const { swipeEnabled } = useContext(AuthContext)
  const { isRecording } = useSelector(state => state.camera)
  const currentIndex = path(['navigationState', 'index'])(props)
  const nextIndex = path(['navigationState', 'routes', currentIndex, 'state', 'index'])(props)
  const hasNextScreen = !nextIndex || nextIndex === 0
  const isSwipeEnabled = !isRecording && swipeEnabled && hasNextScreen
  return <ViewPagerAdapter {...props} swipeEnabled={isSwipeEnabled} />
}

const pager = (props) => <AppViewPagerAdapter {...props} />

export default pager
