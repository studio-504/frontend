import React, { useEffect, useCallback } from 'react'
import HeaderRight from 'navigation/HeaderRight'
import { useNavigation } from '@react-navigation/native'

export const useHeader = ({
  onPress,
  title,
  disabled,
  hidden,
}) => {
  const navigation = useNavigation()

  /**
   *
   */
  const headerRight = useCallback(() =>
    <HeaderRight onPress={onPress} title={title} disabled={disabled} hidden={hidden} />
  , [disabled, hidden])
  
  /**
   *
   */
  useEffect(() => {
    navigation.setOptions({
      headerRight,
    })
  }, [disabled, hidden])
}

