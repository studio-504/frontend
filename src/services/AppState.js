import { useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import propOr from 'ramda/src/propOr'

const noop = () => {}
const getCallback = propOr(noop)

export default function useAppState(settings) {
  const appState = useRef(AppState.currentState)
  const onForeground = getCallback('onForeground', settings)
  const onBackground = getCallback('onBackground', settings)

  function handleAppStateChange(nextAppState) {
    if (nextAppState === 'active' && appState.current.match(/inactive|background/)) {
      onForeground()
    } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      onBackground()
    }

    appState.current = nextAppState
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)

    return () => AppState.removeEventListener('change', handleAppStateChange)
  }, [])
}
