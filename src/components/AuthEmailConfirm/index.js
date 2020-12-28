import React from 'react'
import PropTypes from 'prop-types'
import propOr from 'ramda/src/propOr'
import { View, StyleSheet } from 'react-native'
import FormComponent from 'components/AuthEmailConfirm/Form'
import AuthHeaderTemplate from 'templates/Auth/Header'

import { withTranslation } from 'react-i18next'
import testIDs from './test-ids'

const AuthEmailConfirm = ({
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
          title={t('Enter 6-digit code')}
          subtitle={
            propOr(false, 'cognitoUsername', formInitialValues)
              ? t('Sent to {{cognitoUsername}}', formInitialValues)
              : t('You’ve been sent a password reset token')
          }
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

AuthEmailConfirm.propTypes = {
  t: PropTypes.any,
  handleFormSubmit: PropTypes.any,
  formSubmitLoading: PropTypes.any,
  formSubmitDisabled: PropTypes.any,
  formInitialValues: PropTypes.any,
}

export default withTranslation()(AuthEmailConfirm)
