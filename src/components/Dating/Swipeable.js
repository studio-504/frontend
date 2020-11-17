import React, { useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  View,
  StyleSheet,
} from 'react-native'
import {
  FlingGestureHandler,
  Directions,
} from 'react-native-gesture-handler'

import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const Swipeable = ({ children }) => {
  const [flingPosition, setFlingPosition] = useState('DOWN')

  const STATIC_VIEW_HEIGHT_MIN = 152
  const STATIC_VIEW_HEIGHT_MAX = useRef(1000)

  const animatedHeight = new Animated.Value(STATIC_VIEW_HEIGHT_MIN)
  const animatedHeightRef = useRef(animatedHeight)

  const handleOnLayout = ({ nativeEvent }) => {
    STATIC_VIEW_HEIGHT_MAX.current = nativeEvent.layout.height
  }

  /**
   * Expand handler
   */
  const onUpFlingHandlerStateChange = useCallback(() => {
    Animated.timing(animatedHeight, {
      toValue: STATIC_VIEW_HEIGHT_MAX.current,
      duration: 300,
    }).start()
    setFlingPosition('UP')
  }, [])

  /**
   * Shrink handler
   */
  const onDownFlingHandlerStateChange = useCallback(() => {
    Animated.timing(animatedHeight, {
      toValue: STATIC_VIEW_HEIGHT_MIN,
      duration: 300,
    }).start()
    setFlingPosition('DOWN')
  }, [])

  const onToggleFlingHandlerStateChange = useCallback(() => {
    if (flingPosition === 'DOWN') {
      onUpFlingHandlerStateChange()
    }

    if (flingPosition === 'UP') {
      onDownFlingHandlerStateChange()
    }
  }, [flingPosition])

  return (
    <View style={styles.root} onLayout={handleOnLayout}>
      <FlingGestureHandler
        direction={Directions.UP}
        onHandlerStateChange={onUpFlingHandlerStateChange}
      >
        <FlingGestureHandler
          direction={Directions.DOWN}
          onHandlerStateChange={onDownFlingHandlerStateChange}
        >
          {children({
            animatedHeightRef,
            onUpFlingHandlerStateChange,
            onDownFlingHandlerStateChange,
            onToggleFlingHandlerStateChange,
            flingPosition,
          })}
        </FlingGestureHandler>
      </FlingGestureHandler>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

Swipeable.propTypes = {
  children: PropTypes.any,
}

export default withTranslation()(withTheme(Swipeable))
