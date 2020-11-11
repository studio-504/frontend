import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import TextField from 'components/Formik/TextField'
import PickerField from 'components/Formik/PickerField'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import CollapsableComponent from 'templates/Collapsable'
import { Formik, Field } from 'formik'
import { withTranslation } from 'react-i18next'
import * as Yup from 'yup'
import * as Validation from 'services/Validation'

const formSchema = Yup.object().shape({
  dateOfBirthMonth: Validation.dateOfBirthMonth,
  dateOfBirthDay: Validation.dateOfBirthDay,
  dateOfBirthYear: Validation.dateOfBirthYear,
  gender: Validation.gender,
  fullName: Validation.fullName,
  bio: Validation.bio,
})

const DatingAboutForm = ({
  t,
  handleSubmit,
  loading,
  values,
  errors,
}) => {
  return (
    <View style={styles.root}>
      <CollapsableComponent
        style={styles.input}
        title="Your Date of Birth"
        helper="Change your date of birth"
        active={true}
        success={values.dateOfBirthMonth && values.dateOfBirthDay && values.dateOfBirthYear}
        error={errors.dateOfBirthMonth || errors.dateOfBirthDay || errors.dateOfBirthYear}
        accessibilityLabel="Toggle Your Date of Birth"
      >
        <View style={styles.row}>
          <View style={styles.item}>
            <Field
              name="dateOfBirthMonth"
              component={PickerField}
              placeholder={{ label: 'Month', value: undefined }}
              items={Validation.monthsOptions}
              textInputProps={{ accessibilityLabel: 'dateOfBirthMonth' }}
            />
          </View>
          <View style={styles.item}>
            <Field
              name="dateOfBirthDay"
              component={PickerField}
              placeholder={{ label: 'Day', value: undefined }}
              items={Validation.datesOptions}
              textInputProps={{ accessibilityLabel: 'dateOfBirthDay' }}
            />
          </View>
          <View style={styles.item}>
            <Field
              name="dateOfBirthYear"
              component={PickerField}
              placeholder={{ label: 'Year', value: undefined }}
              items={Validation.yearsOptions}
              textInputProps={{ accessibilityLabel: 'dateOfBirthYear' }}
            />
          </View>
        </View>
      </CollapsableComponent>

      <CollapsableComponent
        style={styles.input}
        title="Your Gender"
        helper="Change your gender"
        active={false}
        success={values.gender}
        error={errors.gender}
        accessibilityLabel="Toggle Gender"
      >
        <Field
          name="gender"
          component={PickerField}
          placeholder={{ label: 'Your Gender', value: undefined }}
          items={Validation.genderOptions}
          textInputProps={{ accessibilityLabel: 'gender' }}
        />
      </CollapsableComponent>
      <CollapsableComponent
        style={styles.input}
        title="Your Full Name"
        helper="Change your full name"
        active={false}
        success={values.fullName}
        error={errors.fullName}
        accessibilityLabel="Toggle Full Name"
      >
        <Field name="fullName" component={TextField} placeholder={t('Your Full Name')} accessibilityLabel="fullName" />
      </CollapsableComponent>
      <CollapsableComponent
        style={styles.input}
        title="Bio"
        helper="Change your bio"
        active={false}
        success={values.bio}
        error={errors.bio}
        accessibilityLabel="Toggle Bio"
      >
        <Field name="bio" component={TextField} placeholder={t('Bio')} accessibilityLabel="bio" />
      </CollapsableComponent>
      <View style={styles.input}>
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
  row: {
    flexDirection: 'row',
    marginHorizontal: -12,
  },
  item: {
    flex: 1,
    marginHorizontal: 12,
  },
})

DatingAboutForm.propTypes = {
  t: PropTypes.any,
  handleSubmit: PropTypes.any,
  loading: PropTypes.any,
  values: PropTypes.any,
  setFieldValue: PropTypes.any,
  errors: PropTypes.any,
}

export default withTranslation()(({
  form,
  ...props
}) => (
  <Formik
    initialValues={form.formInitialValues}
    validationSchema={formSchema}
    onSubmit={form.handleFormSubmit}
    enableReinitialize
  >
    {(formikProps) => (
      <DatingAboutForm
        {...formikProps}
        {...props}
        {...form}
        loading={form.formSubmitLoading}
        disabled={form.formSubmitDisabled}
      />
    )}
  </Formik>
))
