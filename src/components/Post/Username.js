import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import DiamondIcon from 'assets/svg/post/Diamond'
import * as purchasesConstants from 'store/ducks/purchases/constants'
import path from 'ramda/src/path'

export const renderDiamond = ({ user, theme }) => {
  return path(['subscriptionLevel'], user) === purchasesConstants.SUBSCRIPTION_LEVEL.DIAMOND ? (
    <DiamondIcon fill={theme.colors.text} />
  ) : null
}

const Username = ({ theme, user }) => (
  <View style={styles.root}>
    <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
      {path(['username'], user)}
    </Text>
    {renderDiamond({ user, theme })}
  </View>
)

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  username: {
    marginRight: 4,
  },
})

Username.propTypes = {
  theme: PropTypes.any,
  user: PropTypes.shape({
    username: PropTypes.string,
    subscriptionLevel: PropTypes.string,
  }),
}

export default withTheme(Username)
