import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import pathOr from 'ramda/src/pathOr'
import CircleAvatar from 'templates/CircleAvatar'
import { withTheme } from 'react-native-paper'

const Photo = ({ theme, activeUpload }) => {
  const styling = styles
  const progress = pathOr(0, ['meta', 'progress'])(activeUpload)
  const image =
    pathOr(null, ['payload', 'preview', 0])(activeUpload) ||
    pathOr(null, ['payload', 'image', 'url480p'])(activeUpload)

  return (
    <View style={styling.root}>
      <AnimatedCircularProgress
        size={128}
        width={3}
        fill={progress}
        tintColor={theme.colors.primary}
        backgroundColor={theme.colors.disabled}
      />
      <View style={styling.icon}>
        <CircleAvatar image={image} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    position: 'absolute',
    padding: 4,
  },
})

Photo.propTypes = {
  theme: PropTypes.any,
  activeUpload: PropTypes.any,
}

export default withTheme(Photo)
