import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import TextField from 'components/Formik/TextField'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import * as Validation from 'services/Validation'
import { withTranslation } from 'react-i18next'

const formSchema = Yup.object().shape({
  code: Validation.promocode,
})

const PromocodesForm = ({ t, handleSubmit, loading }) => {
  return (
    <View>
      <View style={styles.input}>
        <Field
          {...Validation.getInputTypeProps('promocode')}
          name="code"
          component={TextField}
          placeholder={t('Promocode')}
        />
      </View>
      <View style={styles.input}>
        <DefaultButton label={t('Redeem')} onPress={handleSubmit} loading={loading} disabled={loading} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
})

PromocodesForm.propTypes = {
  t: PropTypes.any,
  handleSubmit: PropTypes.any,
  loading: PropTypes.any,
}

export default withTranslation()(({ handleFormSubmit, formSubmitLoading, formInitialValues, ...props }) => (
  <Formik
    initialValues={formInitialValues}
    validationSchema={formSchema}
    onSubmit={handleFormSubmit}
    enableReinitialize
  >
    {(formikProps) => <PromocodesForm {...formikProps} {...props} loading={formSubmitLoading} />}
  </Formik>
))
