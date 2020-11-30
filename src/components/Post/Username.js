import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import DiamondIcon from 'assets/svg/post/Diamond'
import * as purchasesConstants from 'store/ducks/purchases/constants'
import path from 'ramda/src/path'

const Username = ({ theme, user }) => (
  <View style={styles.root}>
    <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
      {path(['username'], user)}
    </Text>
    {user.subscriptionLevel === purchasesConstants.SUBSCRIPTION_LEVEL.DIAMOND ? (
      <DiamondIcon style={styles.icon} fill={theme.colors.text} />
    ) : null}
  </View>
)

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  username: {
    marginRight: 4,
  },
  icon: {
    height: 1,
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
