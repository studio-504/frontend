import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import ProfileEditForm from 'components/ProfileEdit/Form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { withTheme } from 'react-native-paper'
import testIDs from './test-ids'

const ProfileEdit = ({
  theme,
  formInitialValues,
  formSubmitLoading,
  handleFormSubmit,
}) => {
  const styling = styles(theme)

  return (
    <View style={styling.root} testID={testIDs.root}>
      <KeyboardAwareScrollView>
        <ProfileEditForm
          formInitialValues={formInitialValues}
          formSubmitLoading={formSubmitLoading}
          handleFormSubmit={handleFormSubmit}
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
  formInitialValues: PropTypes.any,
  formSubmitLoading: PropTypes.bool,
  handleFormSubmit: PropTypes.func,
}

ProfileEdit.defaultProps = {
  formSubmitLoading: false,
}

export default withTheme(ProfileEdit)

