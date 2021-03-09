import React, { useEffect } from 'react'
import { Keyboard } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import * as navigationOptions from 'navigation/options'
import CameraScreen from 'screens/CameraScreen'
import RootNavigator from 'navigation/RootNavigator'
import ChatNavigator from 'navigation/ChatNavigator'

const Tab = createMaterialTopTabNavigator()

const AppNavigator = () => {
  const tabNavigatorDefaultProps = navigationOptions.tabNavigatorDefaultProps()

  useEffect(() => {
    Keyboard.dismiss()
  }, [])

  return (
    <Tab.Navigator {...tabNavigatorDefaultProps}>
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
      />
      <Tab.Screen
        name="Root"
        component={RootNavigator}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
      />
    </Tab.Navigator>
  )
}

export default AppNavigator
