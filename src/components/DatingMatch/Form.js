import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
} from 'react-native'
import MapField from 'components/Formik/MapField'
import PickerField from 'components/Formik/PickerField'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import CollapsableComponent from 'templates/Collapsable'
import { Formik, Field } from 'formik'
import { withTranslation } from 'react-i18next'
import * as Yup from 'yup'
import * as Validation from 'services/Validation'

const formSchema = Yup.object().shape({
  matchAgeRangeMin: Validation.matchAgeRangeMin,
  matchAgeRangeMax: Validation.matchAgeRangeMax,
  matchLocationRadius: Validation.matchLocationRadius,
  matchGenders: Validation.matchGenders,
  matchHeightRangeMin: Validation.height,
  matchHeightRangeMax: Validation.height,
})

const DatingMatchForm = ({
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
        title="Match Age"
        helper="Change match age range"
        active={true}
        success={values.matchAgeRangeMin && values.matchAgeRangeMax}
        error={errors.matchAgeRangeMin || errors.matchAgeRangeMax}
        accessibilityLabel="Toggle Match Age"
      >
        <View style={styles.row}>
          <View style={styles.item}>
            <Field
              name="matchAgeRangeMin"
              textInputProps={{ accessibilityLabel: 'matchAgeRangeMin' }}
              component={PickerField}
              placeholder={{ label: 'Match Minimum Age', value: undefined }}
              items={Validation.minAgeOptions}
            />
          </View>
          <View style={styles.item}>
            <Field
              name="matchAgeRangeMax"
              textInputProps={{ accessibilityLabel: 'matchAgeRangeMax' }}
              component={PickerField}
              placeholder={{ label: 'Match Maximum Age', value: undefined }}
              items={Validation.getMaxAgeOptions(values.matchAgeRangeMin)}
            />
          </View>
        </View>
      </CollapsableComponent>

      <CollapsableComponent
        style={styles.input}
        title="Match Gender"
        helper="Change match gender"
        active={false}
        success={values.matchGenders}
        errors={values.matchGenders}
        accessibilityLabel="Toggle Match Gender"
      >
        <Field
          name="matchGenders"
          textInputProps={{ accessibilityLabel: 'matchGenders' }}
          component={PickerField}
          placeholder={{ label: 'Match Gender', value: undefined }}
          items={Validation.genderOptions}
        />
      </CollapsableComponent>

      <CollapsableComponent
        style={styles.input}
        title="Match Height"
        helper="Change match height"
        active={false}
        success={values.matchHeightRange}
        errors={values.matchHeightRange}
        accessibilityLabel="Toggle Match Height"
      >
        <View style={styles.row}>
          <View style={styles.item}>
            <Field
              name="matchHeightRangeMin"
              textInputProps={{ accessibilityLabel: 'matchHeightRangeMin' }}
              component={PickerField}
              placeholder={{ label: 'Match Minimum Height', value: undefined }}
              items={Validation.heightOptions}
            />
          </View>
          <View style={styles.item}>
            <Field
              name="matchHeightRangeMax"
              textInputProps={{ accessibilityLabel: 'matchHeightRangeMax' }}
              component={PickerField}
              placeholder={{ label: 'Match Maximum Height', value: undefined }}
              items={Validation.heightOptions}
            />
          </View>
        </View>
      </CollapsableComponent>

      <CollapsableComponent
        style={styles.input}
        title="Match Location Range"
        helper="Change match location range"
        active={false}
        success={values.matchLocationRadius}
        error={errors.matchLocationRadius}
        accessibilityLabel="Toggle Match Location Range"
      >
        <Field
          name="matchLocationRadius"
          textInputProps={{ accessibilityLabel: 'matchLocationRadius' }}
          component={PickerField}
          placeholder={{ label: 'Match Location Range', value: undefined }}
          items={Validation.locationOptions}
        />
      </CollapsableComponent>
      <CollapsableComponent
        style={styles.input}
        title="Match Location"
        helper="Change match location"
        active={false}
        success={values.location}
        error={errors.location}
        accessibilityLabel="Toggle Match Location"
      >
        <Field name="location" component={MapField} placeholder={t('Match Location')} />
      </CollapsableComponent>
      <View style={styles.input}>
        <DefaultButton accessibilityLabel="Submit" label={t('Next')} onPress={handleSubmit} loading={loading} disabled={loading} />
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

DatingMatchForm.propTypes = {
  t: PropTypes.any,
  handleSubmit: PropTypes.any,
  loading: PropTypes.any,
  values: PropTypes.any,
  setFieldValue: PropTypes.any,
  errors: PropTypes.any,
}

export default withTranslation()(({
  handleFormSubmit,
  formInitialValues,
  formSubmitLoading,
  formSubmitDisabled,
  ...props
}) => (
  <Formik
    initialValues={formInitialValues}
    validationSchema={formSchema}
    onSubmit={handleFormSubmit}
    enableReinitialize
  >
    {(formikProps) => (
      <DatingMatchForm
        {...formikProps}
        {...props}
        loading={formSubmitLoading}
        disabled={formSubmitDisabled}
      />
    )}
  </Formik>
))
