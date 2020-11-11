import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import DatingSettingsForm from 'components/DatingSettings/Form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { withTheme } from 'react-native-paper'
import AuthErrorTemplate from 'templates/Auth/Error'

const DatingSettings = ({ 
  theme, 
  handleFormSubmit, 
  formInitialValues, 
  formSubmitLoading, 
  formErrorMessage,
  handleErrorClose,
}) => {
  const styling = styles(theme)

  return (
    <View style={styling.root}>
      {formErrorMessage ?
        <AuthErrorTemplate
          text={formErrorMessage}
          onClose={handleErrorClose}
        />
      : null}
      <KeyboardAwareScrollView>
        <View style={styling.form}>
          <DatingSettingsForm
            handleFormSubmit={handleFormSubmit}
            formInitialValues={formInitialValues}
            formSubmitLoading={formSubmitLoading}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

DatingSettings.propTypes = { 
  theme: PropTypes.any, 
  handleFormSubmit: PropTypes.func, 
  formInitialValues: PropTypes.any, 
  formSubmitLoading: PropTypes.bool, 
  handleErrorClose: PropTypes.func,
  formErrorMessage: PropTypes.string,
}

DatingSettings.defaultProps = {
  formSubmitLoading: false, 
  formErrorMessage: null,
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    form: {
      padding: theme.spacing.base,
    },
  })

export default withTheme(DatingSettings)
