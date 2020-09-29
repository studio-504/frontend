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

const DatingMatchForm = ({
  t,
  handleSubmit,
  loading,
}) => {
  const styling = styles
  
  return (
    <View style={styling.root}>
      <View style={styling.input}>
        <Field name="age" component={TextField} placeholder={t('Match Age')} />
      </View>
      <View style={styling.input}>
        <Field name="gender" component={TextField} placeholder={t('Match Gender')} />
      </View>
      <View style={styling.input}>
        <Field name="range" component={TextField} placeholder={t('Match Location Range')} />
      </View>
      <View style={styling.input}>
        <Field name="location" component={TextField} placeholder={t('Match Location')} />
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

DatingMatchForm.propTypes = {
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
      <DatingMatchForm
        {...formikProps}
        {...props}
        loading={usersEditProfile.status === 'loading'}
      />
    )}
  </Formik>
))
