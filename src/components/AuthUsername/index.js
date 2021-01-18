import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
} from 'react-native'
import FormComponent from 'components/AuthUsername/Form'
import AuthHeaderTemplate from 'templates/Auth/Header'

import { withTranslation } from 'react-i18next'
import testIDs from './test-ids'

const AuthUsername = ({
  t,
  handleFormSubmit,
  formSubmitLoading,
  formSubmitDisabled,
  formInitialValues,
}) => {
  return (
    <View testID={testIDs.root} style={styles.root}>
      <View style={styles.component}>
        <AuthHeaderTemplate
          title={t('Grab Your Username!')}
          subtitle={t('You can always change it later')}
        />

        <View style={styles.content}>
          <FormComponent
            handleFormSubmit={handleFormSubmit}
            formSubmitLoading={formSubmitLoading}
            formSubmitDisabled={formSubmitDisabled}
            formInitialValues={formInitialValues}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 50,
  },
  component: {
    paddingHorizontal: 24,
    flex: 1,
  },
  content: {
    flex: 1,
  },
})

AuthUsername.propTypes = {
  t: PropTypes.any,
  handleFormSubmit: PropTypes.any,
  formSubmitLoading: PropTypes.any,
  formSubmitDisabled: PropTypes.any,
  formInitialValues: PropTypes.any,
}

export default withTranslation()(AuthUsername)
