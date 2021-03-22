import { AppState } from 'react-native'
import { renderHook } from '@testing-library/react-hooks'
import useAppState from 'services/AppState'

const onForeground = jest.fn()
const onBackground = jest.fn()

describe('AppState hook', () => {
  afterEach(() => {
    AppState.addEventListener.mockClear()
    AppState.removeEventListener.mockClear()
    onForeground.mockClear()
    onBackground.mockClear()
  })

  describe('onForeground', () => {
    it('noop callback by default', () => {
      AppState.currentState = 'inactive'

      renderHook(() => useAppState())

      const [event, handleAppStateChange] = AppState.addEventListener.mock.calls[0]

      expect(event).toBe('change')
      handleAppStateChange('active')
    })

    it('inactive to active', () => {
      AppState.currentState = 'inactive'

      renderHook(() => useAppState({ onForeground }))

      expect(AppState.addEventListener).toHaveBeenCalled()
      const [event, handleAppStateChange] = AppState.addEventListener.mock.calls[0]

      expect(event).toBe('change')

      expect(onForeground).not.toHaveBeenCalled()
      handleAppStateChange('active')
      expect(onForeground).toHaveBeenCalled()
    })

    it('background to active', () => {
      AppState.currentState = 'inactive'

      renderHook(() => useAppState({ onForeground }))

      expect(AppState.addEventListener).toHaveBeenCalled()
      const [event, handleAppStateChange] = AppState.addEventListener.mock.calls[0]

      expect(event).toBe('change')

      expect(onForeground).not.toHaveBeenCalled()
      handleAppStateChange('active')
      expect(onForeground).toHaveBeenCalled()
    })

    it('inactive to background', () => {
      AppState.currentState = 'inactive'

      renderHook(() => useAppState({ onForeground }))

      expect(AppState.addEventListener).toHaveBeenCalled()
      const [event, handleAppStateChange] = AppState.addEventListener.mock.calls[0]

      expect(event).toBe('change')
      handleAppStateChange('background')
      expect(onForeground).not.toHaveBeenCalled()
    })
  })

  describe('onBackground', () => {
    it('noop callback by default', () => {
      AppState.currentState = 'active'

      renderHook(() => useAppState())

      const [event, handleAppStateChange] = AppState.addEventListener.mock.calls[0]

      expect(event).toBe('change')
      handleAppStateChange('inactive')
    })

    it('active to inactive', () => {
      AppState.currentState = 'active'

      renderHook(() => useAppState({ onBackground }))

      expect(AppState.addEventListener).toHaveBeenCalled()
      const [event, handleAppStateChange] = AppState.addEventListener.mock.calls[0]

      expect(event).toBe('change')

      expect(onBackground).not.toHaveBeenCalled()
      handleAppStateChange('inactive')
      expect(onBackground).toHaveBeenCalled()
    })

    it('active to background', () => {
      AppState.currentState = 'active'

      renderHook(() => useAppState({ onBackground }))

      expect(AppState.addEventListener).toHaveBeenCalled()
      const [event, handleAppStateChange] = AppState.addEventListener.mock.calls[0]

      expect(event).toBe('change')

      expect(onBackground).not.toHaveBeenCalled()
      handleAppStateChange('background')
      expect(onBackground).toHaveBeenCalled()
    })

    it('inactive to background', () => {
      AppState.currentState = 'inactive'

      renderHook(() => useAppState({ onBackground }))

      expect(AppState.addEventListener).toHaveBeenCalled()
      const [event, handleAppStateChange] = AppState.addEventListener.mock.calls[0]

      expect(event).toBe('change')
      handleAppStateChange('background')
      expect(onBackground).not.toHaveBeenCalled()
    })
  })
})
