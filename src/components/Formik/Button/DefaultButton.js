import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
} from 'react-native'
import { Button } from 'react-native-paper'

import { withTheme } from 'react-native-paper'

const DefaultButton = ({
  theme,
  label,
  size,
  mode,
  labelStyle,
  ...props
}) => {
  const styling = styles
  

  const contentStyle = (size === 'compact') ? styling.compactContent : styling.defaultContent
  const colorStyle = (mode === 'contained') ? { color: theme.colors.buttonText } : {}

  return (
    <Button {...props} contentStyle={contentStyle} uppercase={false} compact mode={mode} labelStyle={[styling.text, colorStyle, labelStyle]} style={styling.root}>
      {label}
    </Button>
  )
}

const styles = StyleSheet.create({
  root: {
    // backgroundColor: 'rgb(10, 132, 255)',
    overflow: 'hidden',
    borderRadius: 8,
  },
  compactContent: {
    height: 34,
  },
  defaultContent: {
    height: 42,
  },
  text: {
    fontWeight: '500',
    letterSpacing: 0.25,
    fontSize: 15,
    // color: '#ffffff',
  },
})

DefaultButton.propTypes = {
  theme: PropTypes.any,
  label: PropTypes.any,
  size: PropTypes.any,
  mode: PropTypes.any,
  labelStyle: PropTypes.any,
}

DefaultButton.defaultProps = {
  mode: 'contained',
  size: 'default',
  labelStyle: {},
}

export default withTheme(DefaultButton)
