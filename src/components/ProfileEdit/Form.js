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

const formSchema = Yup.object().shape({
  bio: Validation.bio,
  phoneNumber: Validation.phone.nullable(),
  fullName: Validation.fullName,
  username: Validation.username,
})

const ProfileEditForm = ({ t, handleSubmit, loading, values }) => {
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
          name="username"
          accessibilityLabel="username"
          component={TextField}
          placeholder={t('Username')}
          autoCompleteType="name"
        />
      </View>
      <View style={styles.input}>
        <Field
          name="fullName"
          accessibilityLabel="fullName"
          component={TextField}
          placeholder={t('Full Name')}
          autoCompleteType="name"
        />
      </View>
      <View style={styles.input}>
        <Field name="bio" accessibilityLabel="bio" component={TextField} placeholder={t('Bio')} />
      </View>
      <View style={styles.input}>
        <DefaultButton label={t('Update')} onPress={handleSubmit} loading={loading} disabled={loading} />
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
  usersEditProfile: PropTypes.any,
  values: PropTypes.any,
  t: PropTypes.any,
  loading: PropTypes.any,
}

export default withTranslation()(({ usersEditProfile, usersEditProfileRequest, user, ...props }) => (
  <Formik 
    initialValues={user} 
    validationSchema={formSchema} 
    onSubmit={usersEditProfileRequest} 
    enableReinitialize
  >
    {(formikProps) => 
      <ProfileEditForm 
        {...formikProps} 
        {...props} 
        loading={usersEditProfile.status === 'loading'} 
      />
    }
  </Formik>
))
