import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import * as navigationActions from 'navigation/actions'
import { withTheme } from 'react-native-paper'

const HeaderRight = ({ theme, navigation }) => {
  const styling = styles(theme)
  const handlePress = navigationActions.navigatePayouts(navigation)

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styling.text}>$0.00</Text>
    </TouchableOpacity>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    text: {
      fontSize: 16,
      color: theme.colors.primary,
      paddingHorizontal: theme.spacing.base,
      fontWeight: '700',
      textAlign: 'right',
    },
  })

HeaderRight.propTypes = {
  theme: PropTypes.any,
  navigation: PropTypes.any,
}

export default withTheme(HeaderRight)
