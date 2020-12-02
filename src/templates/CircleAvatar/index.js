import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Image, View } from 'react-native'
import ProfileIcon from 'assets/svg/auth/Profile'
import { withTheme } from 'react-native-paper'

const CircleAvatar = ({ theme, image }) => {
  return (
    <View accessibilityLabel="CircleAvatar"> 
      {!image ? <ProfileIcon fill={theme.colors.disabled} /> : <Image source={{ uri: image }} style={styles.image} />}
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
})

CircleAvatar.propTypes = {
  theme: PropTypes.any,
  image: PropTypes.string,
}

CircleAvatar.defaultProps = {
  image: null,
}

export default withTheme(CircleAvatar)
