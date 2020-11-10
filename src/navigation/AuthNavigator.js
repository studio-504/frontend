import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { createStackNavigator } from '@react-navigation/stack'

import { ThemeContext } from 'services/providers/Theme'
import * as navigationOptions from 'navigation/options'
import SignupNavigator from 'navigation/Auth/Signup'
import SigninNavigator from 'navigation/Auth/Signin'
import ForgotNavigator from 'navigation/Auth/Forgot'
import AuthHeader from 'navigation/Auth/Header'
import * as navigationActions from 'navigation/actions'

import AuthHomeScreen from 'screens/AuthHomeScreen'
import AuthUsernameScreen from 'screens/AuthUsernameScreen'
import AuthPasswordScreen from 'screens/AuthPasswordScreen'
import AuthPhoneConfirmScreen from 'screens/AuthPhoneConfirmScreen'
import AuthEmailConfirmScreen from 'screens/AuthEmailConfirmScreen'
import VerificationScreen from 'screens/VerificationScreen'
import CameraScreen from 'screens/CameraScreen'
import AuthForgotConfirmScreen from 'screens/AuthForgotConfirmScreen'

const Stack = createStackNavigator()

const AuthNavigator = ({ navigation }) => {
  const { theme } = useContext(ThemeContext)
  const stackScreenBlankProps = navigationOptions.stackScreenBlankProps({ theme })
  const stackScreenAuthProps = navigationOptions.stackScreenAuthProps({ theme })
  const stackScreenAuthModalProps = navigationOptions.stackScreenAuthModalProps({ theme })
 
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        cardOverlayEnabled: true,
        animationEnabled: false,
        header: AuthHeader,
      }}
    >
      <Stack.Screen
        name="AuthHome"
        component={AuthHomeScreen}
        {...stackScreenAuthProps({
          options: {
            title: 'Signup for REAL',
            handleLeftPress: undefined,
            handleRightPress: () => navigationActions.navigateApp(navigation),
          },
        })}
      /> 

      <Stack.Screen
        name="Signup"
        component={SignupNavigator}
        {...stackScreenAuthProps({
          options: {
            title: 'Signup',
            handleLeftPress: () => navigationActions.navigateAuthHome(navigation),
            handleRightPress: () => navigationActions.navigateApp(navigation),
          },
        })}
      />

      <Stack.Screen
        name="Signin"
        component={SigninNavigator}
        {...stackScreenAuthProps({
          options: {
            title: 'Log In',
            handleLeftPress: () => navigationActions.navigateAuthHome(navigation),
            handleRightPress: () => navigationActions.navigateApp(navigation),
          },
        })}
      />

      <Stack.Screen
        name="Forgot"
        component={ForgotNavigator}
        {...stackScreenAuthProps({
          options: {
            title: 'Forgot',
            handleLeftPress: () => navigationActions.navigateAuthHome(navigation),
            handleRightPress: () => navigationActions.navigateApp(navigation),
          },
        })}
      />

      <Stack.Screen
        name="AuthUsername"
        component={AuthUsernameScreen}
        {...stackScreenAuthProps({
          options: {
            title: 'Username',
            handleLeftPress: undefined,
            handleRightPress: () => navigationActions.navigateApp(navigation),
          },
        })}
      />

      <Stack.Screen
        name="AuthPassword"
        component={AuthPasswordScreen}
        {...stackScreenAuthProps({
          options: {
            title: 'Password',
            handleLeftPress: undefined,
            handleRightPress: () => navigationActions.navigateApp(navigation),
          },
        })}
      />

      <Stack.Screen
        name="AuthEmailConfirm"
        component={AuthEmailConfirmScreen}
        {...stackScreenAuthProps({
          options: {
            title: 'Enter 6-digit code',
            handleLeftPress: () => navigationActions.navigateAuthEmail(navigation),
            handleRightPress: () => navigationActions.navigateApp(navigation),
          },
        })}
      />

      <Stack.Screen
        name="AuthPhoneConfirm"
        component={AuthPhoneConfirmScreen}
        {...stackScreenAuthProps({
          options: {
            title: 'Enter 6-digit code',
            handleLeftPress: () => navigationActions.navigateAuthPhone(navigation),
            handleRightPress: () => navigationActions.navigateApp(navigation),
          },
        })}
      />

      <Stack.Screen
        name="Verification"
        component={VerificationScreen}
        {...stackScreenAuthModalProps}
      />

      <Stack.Screen
        name="AuthCamera"
        component={CameraScreen}
        {...stackScreenBlankProps}
      />

      <Stack.Screen
        name="AuthForgotConfirm"
        component={AuthForgotConfirmScreen}
        {...stackScreenAuthProps({
          options: {
            title: 'Forgot Confirm',
            handleLeftPress: () => navigationActions.navigateForgot(navigation),
            handleRightPress: () => navigationActions.navigateApp(navigation),
          },
        })}
      />
    </Stack.Navigator>
  )
}

AuthNavigator.propTypes = {
  navigation: PropTypes.any,
}

export default AuthNavigator