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
import { withTranslation } from 'react-i18next'

const formSchema = Yup.object().shape({
})

const DatingAboutForm = ({
  t,
  handleSubmit,
  loading,
}) => {
  const styling = styles
  
  return (
    <View style={styling.root}>
      <View style={styling.input}>
        <Field name="dateOfBirth" component={TextField} placeholder={t('Your Date of Birth')} />
      </View>
      <View style={styling.input}>
        <Field name="gender" component={TextField} placeholder={t('Your Gender')} />
      </View>
      <View style={styling.input}>
        <Field name="fullName" component={TextField} placeholder={t('Your Full Name')} />
      </View>
      <View style={styling.input}>
        <Field name="bio" component={TextField} placeholder={t('Your Bio')} />
      </View>
      <View style={styling.input}>
        <DefaultButton label={t('Next')} onPress={handleSubmit} loading={loading} disabled={loading} />
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

DatingAboutForm.propTypes = {
  t: PropTypes.any,
  handleSubmit: PropTypes.any,
  loading: PropTypes.any,
}

export default withTranslation()(({
  usersEditProfile,
  usersEditProfileRequest,
  user,
  ...props
}) => (
  <Formik
    initialValues={user}
    validationSchema={formSchema}
    onSubmit={usersEditProfileRequest}
    enableReinitialize
  >
    {(formikProps) => (
      <DatingAboutForm
        {...formikProps}
        {...props}
        loading={usersEditProfile.status === 'loading'}
      />
    )}
  </Formik>
))
