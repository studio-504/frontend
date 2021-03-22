import { useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'

export function useEffectWhenFocused(callback, params) {
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) return

    callback()
  }, params)
}
