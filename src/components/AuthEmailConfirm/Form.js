import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import TextField from 'components/Formik/TextField'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import * as Validation from 'services/Validation'

import { withTranslation } from 'react-i18next'
import testIDs from './test-ids'

const formSchema = Yup.object().shape({
  confirmationCode: Validation.confirmationCode,
})

const EmailConfirmForm = ({
  t,
  handleSubmit,
  loading,
}) => {
  return (
    <View style={styles.root}>
      <View style={styles.input}>
        <Field
          {...Validation.getInputTypeProps('confirmationCode')}
          testID={testIDs.form.confirmationCode}
          component={TextField}
          name="confirmationCode"
          placeholder="Confirmation Code"
        />
      </View>

      <View style={styles.input}>
        <DefaultButton
          testID={testIDs.form.confirmButton}
          label={t('Next')}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
  },
  input: {
    marginBottom: 12,
  },
})

EmailConfirmForm.propTypes = {
  t: PropTypes.any,
  handleSubmit: PropTypes.any,
  loading: PropTypes.any,
}

export default withTranslation()(({
  handleFormSubmit,
  formSubmitLoading,
  formSubmitDisabled,
  formInitialValues,
  ...props
}) => (
  <Formik
    initialValues={formInitialValues}
    validationSchema={formSchema}
    onSubmit={handleFormSubmit}
    enableReinitialize
  >
    {(formikProps) => (
      <EmailConfirmForm
        {...formikProps}
        {...props}
        loading={formSubmitLoading}
        disabled={formSubmitDisabled}
      />
    )}
  </Formik>
))
