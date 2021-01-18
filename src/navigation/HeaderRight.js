import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'

import { withTheme, Text } from 'react-native-paper'
import { withTranslation } from 'react-i18next'

const HeaderRight = ({
  t,
  title,
  theme,
  onPress,
  hidden,
  style = {},
  children,
  testID,
  disabled,
  containerStyle,
  loading,
}) => {
  const styling = styles(theme)

  if (hidden) {
    return null
  }

  return (
    <TouchableOpacity testID={testID} onPress={onPress} disabled={disabled || loading} style={containerStyle}>
      {loading ? (
        <ActivityIndicator style={styling.loader} size="small" color={theme.colors.primaryIcon} />
      ) : children ? (
        <View style={[styling.headerRight, style]}>{children}</View>
      ) : (
        <Text style={[styling.headerRight, style]}>{t(title)}</Text>
      )}
    </TouchableOpacity>
  )
}

HeaderRight.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  title: PropTypes.any,
  onPress: PropTypes.any,
  hidden: PropTypes.any,
  style: PropTypes.any,
  children: PropTypes.any,
  testID: PropTypes.string,
  disabled: PropTypes.bool,
  containerStyle: PropTypes.object,
  loading: PropTypes.bool,
}

HeaderRight.defaultProps = {
  hidden: false,
  style: {},
  testID: null,
  disabled: false,
  containerStyle: null,
  loading: false,
}

const styles = (theme) =>
  StyleSheet.create({
    loader: {
      paddingHorizontal: theme.spacing.base,
    },
    headerRight: {
      paddingHorizontal: theme.spacing.base,
      fontSize: 16,
      fontWeight: '700',
      color: '#3498db',
      textAlign: 'right',
    },
  })

export default withTranslation()(withTheme(HeaderRight))
