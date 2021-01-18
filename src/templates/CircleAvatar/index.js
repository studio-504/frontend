import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Image, View } from 'react-native'
import ProfileIcon from 'assets/svg/auth/Profile'
import { withTheme } from 'react-native-paper'

const CircleAvatar = ({ theme, image, hasBorder }) => {
  const styling = styles(theme)

  return (
    <View accessibilityLabel="CircleAvatar">
      {!image ? (
        <View style={[styling.placeholder, hasBorder ? styling.border : null]}>
          <ProfileIcon fill={theme.colors.disabled} />
        </View>
      ) : (
        <Image source={{ uri: image }} style={styling.image} />
      )}
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    placeholder: {
      width: 128,
      height: 128,
      borderWidth: 3,
      borderRadius: 128,
      borderColor: 'transparent',
    },
    border: {
      borderColor: theme.colors.disabled,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
  })

CircleAvatar.propTypes = {
  theme: PropTypes.any,
  image: PropTypes.string,
  hasBorder: PropTypes.bool,
}

CircleAvatar.defaultProps = {
  image: null,
  hasBorder: false,
}

export default withTheme(CircleAvatar)
