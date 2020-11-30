import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import DiamondIcon from 'assets/svg/post/Diamond'
import * as purchasesConstants from 'store/ducks/purchases/constants'

const Username = ({ theme, user, onPress }) => {
  return user ? (
    <TouchableOpacity onPress={onPress} style={styles.root}>
      <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
        {user.username}
      </Text>
      {user.subscriptionLevel === purchasesConstants.SUBSCRIPTION_LEVEL.DIAMOND ? (
        <DiamondIcon style={styles.icon} fill={theme.colors.text} />
      ) : null}
    </TouchableOpacity>
  ) : null
}

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
  onPress: PropTypes.func,
}

Username.defaultProps = {
  onPress: null,
}

export default withTheme(Username)
