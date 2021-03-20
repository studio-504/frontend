import React, { useState } from 'react'
import AuthNavigator from 'navigation/AuthNavigator'
import AppNavigator from 'navigation/AppNavigator'
import * as navigationOptions from 'navigation/options'
import { createStackNavigator } from '@react-navigation/stack'
import NetworkComponent from 'components/Network'
import PinchZoomComponent from 'components/Feed/PinchZoom'
import FeedContextComponent from 'components/Feed/Context'
import { SearchFeedProvider } from 'components/Search/Context'
import AppLoader from 'components/AppLoader'

const Stack = createStackNavigator()

const Router = () => {
  const [draggedImage, setDraggedImage] = useState({})

  return (
    <FeedContextComponent.Provider value={{ draggedImage, setDraggedImage }}>
      <SearchFeedProvider>
        <PinchZoomComponent />
        <NetworkComponent />
        <Stack.Navigator initialRouteName="Loading">
          <Stack.Screen
            name="Loading"
            component={AppLoader}
            {...navigationOptions.stackScreenStaleStaticProps}
          />
          <Stack.Screen
            name="App"
            component={AppNavigator}
            {...navigationOptions.stackScreenStaleStaticProps}
          />
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            {...navigationOptions.stackScreenModalStaticProps}
          />
        </Stack.Navigator>
      </SearchFeedProvider>
    </FeedContextComponent.Provider>
  )
}

export default Router
