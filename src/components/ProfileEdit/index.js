import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import ProfileEditForm from 'components/ProfileEdit/Form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { withTheme } from 'react-native-paper'

const ProfileEdit = ({
  theme,
  user,
  usersEditProfile,
  usersEditProfileRequest,
}) => {
  const styling = styles(theme)

  return (
    <View style={styling.root}>
      <KeyboardAwareScrollView>
        <ProfileEditForm
          user={user}
          usersEditProfile={usersEditProfile}
          usersEditProfileRequest={usersEditProfileRequest}
        />
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
    padding: theme.spacing.base,
  },
})

ProfileEdit.propTypes = {
  theme: PropTypes.any,
  user: PropTypes.any,
  usersEditProfile: PropTypes.any,
  usersEditProfileRequest: PropTypes.func,
}

export default withTheme(ProfileEdit)

