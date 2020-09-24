import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { StatusBar } from 'react-native'
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
import codePush from 'react-native-code-push' 
import NetworkComponent from 'components/Network'
import PinchZoomComponent from 'components/Feed/PinchZoom'
import FeedContextComponent from 'components/Feed/Context'
import ErrorTemplate from 'templates/Error'
import Config from 'react-native-config' 
import LoadingComponent from 'components/Loading'
import linking from 'navigation/linking'

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  deploymentKey: Config.CODE_PUSH_DEPLOYMENT_KEY,
}

// codePush.sync(codePushOptions)

const Routes = ({
  authenticated,
  appErrorMessage,
  handleErrorClose,
  navigationHandlers,
}) => {
  const { theme, themes } = useContext(ThemesContext)

  return (
    <NavigationContainer
      theme={theme}
      linking={linking}
      ref={navigationHandlers.navigationRef}
      onReady={navigationHandlers.handleRouteInit}
      onStateChange={navigationHandlers.onStateChange}
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
  navigationHandlers: PropTypes.any,
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
              networkIsConnected,
              navigationHandlers,
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
                      handleErrorClose,
                    }) => (
                      <Routes
                        authenticated={authenticated}
                        appErrorMessage={appErrorMessage}
                        handleErrorClose={handleErrorClose}
                        navigationHandlers={navigationHandlers}
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