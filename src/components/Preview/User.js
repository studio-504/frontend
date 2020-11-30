import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import { Text, Caption } from 'react-native-paper'
import Avatar from 'templates/Avatar'
import Username from 'components/Post/Username'
import { withTheme } from 'react-native-paper'

const UserPreview = ({
  theme,
  image: {
    thumbnailSource,
    imageSource,
  },
  user,
  subtitle,
}) => {
  const styling = styles(theme)
  
  return (
    <View style={styling.profile}>
      <Avatar
        thumbnailSource={thumbnailSource}
        imageSource={imageSource}
      />

      <View style={styling.profileText}>
        <Username user={user} />
        <Caption>{subtitle}</Caption>
      </View>
    </View>
  )
}

const styles = theme => StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.base,
  },
  profileText: {
    paddingHorizontal: theme.spacing.base,
  },
})

UserPreview.propTypes = {
  theme: PropTypes.any,
  image: PropTypes.any,
  user: PropTypes.shape({
    username: PropTypes.string
  }),
  subtitle: PropTypes.any,
}

export default withTheme(UserPreview)
