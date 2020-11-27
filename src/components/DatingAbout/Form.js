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
  height: Validation.height,
})

const DatingAboutForm = ({
  t,
  nextAction,
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
              accessibilityLabel="dateOfBirthMonth"
            />
          </View>
          <View style={styles.item}>
            <Field
              name="dateOfBirthDay"
              component={PickerField}
              placeholder={{ label: 'Day', value: undefined }}
              items={Validation.datesOptions}
              accessibilityLabel="dateOfBirthDay"
            />
          </View>
          <View style={styles.item}>
            <Field
              name="dateOfBirthYear"
              component={PickerField}
              placeholder={{ label: 'Year', value: undefined }}
              items={Validation.yearsOptions}
              accessibilityLabel="dateOfBirthYear"
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
          accessibilityLabel="gender"
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
      <CollapsableComponent
        style={styles.input}
        title="Height"
        helper="Change your height"
        active={false}
        success={values.height}
        error={errors.height}
        accessibilityLabel="Toggle Height"
      >
        <Field
          name="height"
          accessibilityLabel="height"
          component={PickerField}
          placeholder={{ label: 'Height', value: undefined }}
          items={Validation.heightOptions}
        />
      </CollapsableComponent>
      <View style={styles.input}>
        <DefaultButton accessibilityLabel="Submit" label={nextAction ? t('Next') : t('Update')} onPress={handleSubmit} loading={loading} disabled={loading} />
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
  nextAction: PropTypes.bool,
  handleSubmit: PropTypes.any,
  loading: PropTypes.any,
  values: PropTypes.any,
  setFieldValue: PropTypes.any,
  errors: PropTypes.any,
}

DatingAboutForm.defaultProps = {
  nextAction: false,
}

export default withTranslation()(({
  handleFormSubmit,
  formInitialValues,
  formSubmitLoading,
  ...props
}) => (
  <Formik
    initialValues={formInitialValues}
    validationSchema={formSchema}
    onSubmit={handleFormSubmit}
    enableReinitialize
  >
    {(formikProps) => (
      <DatingAboutForm
        {...formikProps}
        {...props}
        loading={formSubmitLoading}
      />
    )}
  </Formik>
))
