import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import DatingAboutForm from 'components/DatingAbout/Form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { withTheme } from 'react-native-paper'

const DatingAbout = ({
  theme,
  user,
  usersEditProfile,
  usersEditProfileRequest,
}) => {
  const styling = styles(theme)
  
  return (
    <View style={styling.root}>
      <KeyboardAwareScrollView>
        <View style={styling.form}>
          <DatingAboutForm
            user={user}
            usersEditProfile={usersEditProfile}
            usersEditProfileRequest={usersEditProfileRequest}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
  },
  form: {
    padding: theme.spacing.base,
  },
  danger: {
    padding: theme.spacing.base,
    backgroundColor: theme.colors.backgroundSecondary,
  },
})

DatingAbout.propTypes = {
  theme: PropTypes.any,
  user: PropTypes.any,
  usersEditProfile: PropTypes.any,
  usersEditProfileRequest: PropTypes.any,
  togglePrivacyStatus: PropTypes.func,
  toggleFollowCountsHidden: PropTypes.func,
  toggleViewCountsHidden: PropTypes.func,
  toggleLikesDisabled: PropTypes.func,
  toggleCommentsDisabled: PropTypes.func,
  toggleSharingDisabled: PropTypes.func,
  usersDelete: PropTypes.any,
  usersDeleteRequest: PropTypes.any,
}

export default withTheme(DatingAbout)

