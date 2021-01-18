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
  nextAction,
  theme,
  handleFormSubmit,
  formInitialValues,
  formSubmitLoading,
}) => {
  const styling = styles(theme)
  
  return (
    <View style={styling.root}>
      <KeyboardAwareScrollView>
        <View style={styling.form}>
          <DatingAboutForm
            nextAction={nextAction}
            handleFormSubmit={handleFormSubmit}
            formInitialValues={formInitialValues}
            formSubmitLoading={formSubmitLoading}
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

DatingAbout.propTypes = {
  theme: PropTypes.any,
  nextAction: PropTypes.bool,
  handleFormSubmit: PropTypes.func,
  formInitialValues: PropTypes.any,
  formSubmitLoading: PropTypes.bool,
}

DatingAbout.defaultProps = {
  formSubmitLoading: false, 
  nextAction: false,
}

export default withTheme(DatingAbout)

