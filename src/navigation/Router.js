import React from 'react'
import PropTypes from 'prop-types'
import AuthNavigator from 'navigation/AuthNavigator'
import AppNavigator from 'navigation/AppNavigator'
import * as navigationOptions from 'navigation/options'
import { createStackNavigator } from '@react-navigation/stack'
import LoadingComponent from 'components/Loading'

const Router = () => {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Loading"
        component={LoadingComponent}
        {...navigationOptions.stackScreenModalStaticProps}
      />
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        {...navigationOptions.stackScreenModalStaticProps}
      />
      <Stack.Screen
        name="App"
        component={AppNavigator}
        {...navigationOptions.stackScreenModalStaticProps}
      />
    </Stack.Navigator>
  )
}

Router.propTypes = {
  authenticated: PropTypes.any,
  appErrorMessage: PropTypes.any,
  handleErrorClose: PropTypes.any,
  navigationHandlers: PropTypes.any,
}

export default Router
