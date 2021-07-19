import React, { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { ThemeContext } from 'services/providers/Theme'
import * as navigationOptions from 'navigation/options'
import AuthForgotPhoneScreen from 'screens/AuthForgotPhoneScreen'
import AuthForgotEmailScreen from 'screens/AuthForgotEmailScreen'
import * as authActions from 'store/ducks/auth/actions'
import testIDs from '../test-ids'

const Tab = createMaterialTopTabNavigator()

const ForgotNavigator = () => {
  const dispatch = useDispatch()
  const { theme } = useContext(ThemeContext)
  const tabNavigatorAuthProps = navigationOptions.tabNavigatorAuthProps({ theme })

  const onUnmount = () => {
    dispatch(authActions.authForgotIdle({}))
  }

  useEffect(() => onUnmount, [])

  return (
    <Tab.Navigator {...tabNavigatorAuthProps}>
      <Tab.Screen
        name="AuthForgotPhone"
        component={AuthForgotPhoneScreen}
        options={{
          tabBarLabel: 'Phone',
          tabBarTestID: testIDs.authNavigator.forgot.phone,
        }}
      />
      <Tab.Screen
        name="AuthForgotEmail"
        component={AuthForgotEmailScreen}
        options={{
          tabBarLabel: 'Email',
          tabBarTestID: testIDs.authNavigator.forgot.email,
        }}
      />
    </Tab.Navigator>
  )
}

export default ForgotNavigator
