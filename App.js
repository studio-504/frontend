import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { StatusBar, Text, TextInput } from 'react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from 'services/providers/Auth'
import { AppProvider } from 'services/providers/App'
import { Provider as PaperProvider } from 'react-native-paper'
import { ThemesContext } from 'navigation/context'
import { ReduxNetworkProvider } from 'react-native-offline'
import AuthNavigator from 'navigation/AuthNavigator'
import AppNavigator from 'navigation/AppNavigator'
import store, { persistor } from 'store/index'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import codePush from 'react-native-code-push' 
import 'services/Logger'
import { enableScreens } from 'react-native-screens'
import NetworkComponent from 'components/Network'
import PinchZoomComponent from 'components/Feed/PinchZoom'
import FeedContextComponent from 'components/Feed/Context'
import ErrorTemplate from 'templates/Error'
import Config from 'react-native-config' 
import LoadingComponent from 'components/Loading'

const linking = {
  prefixes: ['real.app://', 'https://real.app/'],
  config: {
    AuthEmailConfirm: 'confirm/email/:userId/:confirmationCode',
    AuthForgotConfirm: 'confirm/forgot/:userId/:confirmationCode',
    Chat: {
      screens: {
        ChatDirect: 'chat/:chatId',
        Chat: 'chat',
      },
    },
    Root: {
      screens: {
        Home: {
          screens: {
            Profile: {
              screens: {
                ProfilePhoto: 'user/:userId/settings/photo',
              },
            },
          },
        },
        Comments: 'user/:userId/post/:postId/comments',
        PostMedia: 'user/:userId/post/:postId',
        Profile: 'user/:userId',
      },
    },
  },
}

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  deploymentKey: Config.CODE_PUSH_DEPLOYMENT_KEY,
}

// codePush.sync(codePushOptions)

enableScreens()

dayjs.extend(relativeTime)

if (Text.defaultProps == null) {
  Text.defaultProps = Text.defaultProps || {}
  Text.defaultProps.allowFontScaling = false
  
  TextInput.defaultProps = TextInput.defaultProps || {}
  TextInput.defaultProps.allowFontScaling = false
}

const Routes = ({
  authenticated,
  appErrorMessage,
  handleErrorClose,
  handleRouteInit,
  onStateChange,
}) => {
  const { theme, themes } = useContext(ThemesContext)
  const routeNameRef = React.useRef()
  const navigationRef = React.useRef()

  return (
    <NavigationContainer
      theme={theme}
      linking={linking}
      ref={navigationRef}
      onReady={handleRouteInit(routeNameRef, navigationRef)}
      onStateChange={onStateChange(routeNameRef, navigationRef)}
    >
      {!authenticated ?
        <PaperProvider theme={themes[0].theme}>
          {appErrorMessage ?
            <ErrorTemplate text={appErrorMessage} onClose={handleErrorClose} />
          : null}
          <AuthNavigator />
        </PaperProvider>
      : null}

      {authenticated ?
        <PaperProvider theme={theme}>
          {appErrorMessage ?
            <ErrorTemplate text={appErrorMessage} onClose={handleErrorClose} />
          : null}

          <AppNavigator themes={themes} />
        </PaperProvider>
      : null}
    </NavigationContainer>
  )
}

Routes.propTypes = {
  authenticated: PropTypes.any,
  appErrorMessage: PropTypes.any,
  handleErrorClose: PropTypes.any,
  handleRouteInit: PropTypes.any,
  onStateChange: PropTypes.any,
}

const App = () => {
  const [draggedImage, setDraggedImage] = useState({})

  return (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <PersistGate loading={(<LoadingComponent />)} persistor={persistor}>
          <AppProvider>
            {({
              theme,
              themes,
              handleErrorClose,
              networkIsConnected,
              handleRouteInit,
              onStateChange,
            }) => (
              <ThemesContext.Provider value={{ theme, themes }}>
                <FeedContextComponent.Provider value={{ draggedImage, setDraggedImage }}>
                  <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
                  <PinchZoomComponent />
                  <NetworkComponent
                    networkIsConnected={networkIsConnected}
                  />

                  <AuthProvider>
                    {({
                      authenticated,
                      appErrorMessage,
                    }) => (
                      <Routes
                        authenticated={authenticated}
                        appErrorMessage={appErrorMessage}
                        handleErrorClose={handleErrorClose}
                        handleRouteInit={handleRouteInit}
                        onStateChange={onStateChange}
                      />
                    )}
                  </AuthProvider>
                </FeedContextComponent.Provider>
              </ThemesContext.Provider>
            )}
          </AppProvider>
        </PersistGate>
      </ReduxNetworkProvider>
    </Provider>
  )
}

 export default codePush(codePushOptions)(App) 