import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import DatingMatchForm from 'components/DatingMatch/Form'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { withTheme } from 'react-native-paper'
import AuthErrorTemplate from 'templates/Auth/Error'

const DatingMatch = ({
  theme,
  nextAction,
  handleFormSubmit,
  formInitialValues,
  formSubmitLoading,
  formSubmitDisabled,
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
          <DatingMatchForm
            nextAction={nextAction}
            handleFormSubmit={handleFormSubmit}
            formInitialValues={formInitialValues}
            formSubmitLoading={formSubmitLoading}
            formSubmitDisabled={formSubmitDisabled}
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
})

DatingMatch.propTypes = {
  theme: PropTypes.any,
  nextAction: PropTypes.bool,
  handleFormSubmit: PropTypes.func,
  formInitialValues: PropTypes.any,
  formSubmitLoading: PropTypes.bool,
  formSubmitDisabled: PropTypes.bool,
  formErrorMessage: PropTypes.string,
  handleErrorClose: PropTypes.func,
}

DatingMatch.defaultProps = {
  nextAction: false,
  formErrorMessage: null,
  formSubmitLoading: false, 
  formSubmitDisabled: false,
}

export default withTheme(DatingMatch)

