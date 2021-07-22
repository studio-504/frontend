import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import TextField from 'components/Formik/TextField'
import TextInput from 'components/TextInput'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import * as Validation from 'services/Validation'
import { withTranslation } from 'react-i18next'
import testIDs from './test-ids'

const formSchema = Yup.object().shape({
  bio: Validation.bio,
  phoneNumber: Validation.phone.nullable(),
  fullName: Validation.fullName,
  username: Validation.username,
})

async function validateUsername(username) {
  try {
    const validator = Validation.remoteUsernameValidation()
    return (await validator(username)) ? undefined : Validation.ERRORS.usernameReserve
  } catch (error) {
    return error.message
  }
}

const ProfileEditForm = ({ t, handleSubmit, loading, values, initialValues }) => {
  return (
    <View style={styles.root}>
      <View style={styles.input}>
        <TextInput name="email" label={t('Email')} value={values.email} accessibilityLabel="email" disabled />
      </View>
      <View style={styles.input}>
        <TextInput
          name="phoneNumber"
          label={t('Phone Number')}
          value={values.phoneNumber}
          accessibilityLabel="phone"
          disabled
        />
      </View>
      <View style={styles.input}>
        <Field
          testID={testIDs.form.username}
          {...Validation.getInputTypeProps('username')}
          name="username"
          component={TextField}
          placeholder={t('Username')}
          validate={async (username) => {
            if (initialValues.username !== username) {
              return await validateUsername(username)
            }
          }}
        />
      </View>
      <View style={styles.input}>
        <Field
          testID={testIDs.form.fullname}
          name="fullName"
          accessibilityLabel="fullName"
          component={TextField}
          placeholder={t('Full Name')}
          autoCompleteType="name"
        />
      </View>
      <View style={styles.input}>
        <Field
          testID={testIDs.form.bio}
          name="bio"
          accessibilityLabel="bio"
          component={TextField} placeholder={t('Bio')}
        />
      </View>
      <View style={styles.input}>
        <DefaultButton
          testID={testIDs.form.submitBtn}
          label={t('Update')}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {},
  input: {
    marginBottom: 12,
  },
})

ProfileEditForm.propTypes = {
  handleSubmit: PropTypes.any,
  submitErrors: PropTypes.any,
  dirtySinceLastSubmit: PropTypes.any,
  formSubmitLoading: PropTypes.bool,
  values: PropTypes.any,
  t: PropTypes.any,
  loading: PropTypes.any,
  initialValues: PropTypes.any,
}

ProfileEditForm.defaultProps = {
  formSubmitLoading: false,
}

export default withTranslation()(({ formSubmitLoading, handleFormSubmit, formInitialValues, ...props }) => (
  <Formik
    initialValues={formInitialValues}
    validationSchema={formSchema}
    onSubmit={handleFormSubmit}
    enableReinitialize
  >
    {(formikProps) =>
      <ProfileEditForm
        {...formikProps}
        {...props}
        loading={formSubmitLoading}
      />
    }
  </Formik>
))
