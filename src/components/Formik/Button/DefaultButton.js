import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Button, withTheme } from 'react-native-paper'

const DefaultButton = ({
  theme,
  label,
  size,
  mode,
  labelStyle,
  style,
  ...props
}) => {
  const contentStyle = (size === 'compact') ? styles.compactContent : styles.defaultContent
  const colorStyle = (mode === 'contained') ? { color: theme.colors.buttonText } : {}

  return (
    <Button {...props} contentStyle={contentStyle} uppercase={false} compact mode={mode} labelStyle={[styles.text, colorStyle, labelStyle]} style={[styles.root, style]}>
      {label}
    </Button>
  )
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
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
  },
})

DefaultButton.propTypes = {
  theme: PropTypes.any,
  label: PropTypes.any,
  size: PropTypes.any,
  mode: PropTypes.any,
  style: PropTypes.any,
  labelStyle: PropTypes.any,
}

DefaultButton.defaultProps = {
  mode: 'contained',
  size: 'default',
  labelStyle: {},
  style: {},
}

export default withTheme(DefaultButton)
