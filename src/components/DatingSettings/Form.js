import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import TextField from 'components/Formik/TextField'
import PickerField from 'components/Formik/PickerField'
import MapField from 'components/Formik/MapField'
import { Formik, Field } from 'formik'
import { withTranslation } from 'react-i18next'
import * as Yup from 'yup'
import { Title, Switch, Text, withTheme } from 'react-native-paper'
import { useHeader } from 'components/DatingSettings/header'
import * as Validation from 'services/Validation'

const formSchema = Yup.object().shape({
  dateOfBirthMonth: Validation.dateOfBirthMonth,
  dateOfBirthDay: Validation.dateOfBirthDay,
  dateOfBirthYear: Validation.dateOfBirthYear,
  gender: Validation.gender,
  fullName: Validation.fullName,
  bio: Validation.bio,
  matchAgeRangeMin: Validation.matchAgeRangeMin,
  matchAgeRangeMax: Validation.matchAgeRangeMax,
  matchLocationRadius: Validation.matchLocationRadius,
  matchGenders: Validation.matchGenders,
})

const DatingSettingsForm = ({ t, theme, handleSubmit, values, loading, disableDating, toggleDatingStatusRequest }) => {
  const styling = styles(theme)

  useHeader({
    onPress: handleSubmit,
    title: t('Update'),
    disabled: loading,
  })

  return (
    <View style={styling.root}>
      <View style={styling.inner}>
        <Title style={styling.title}>{t('Account Settings')}</Title>
        <View style={[styling.row, styling.group]}>
          <View style={styling.item}>
            <Field
              name="dateOfBirthMonth"
              textInputProps={{ accessibilityLabel: 'dateOfBirthMonth' }}
              component={PickerField}
              placeholder={{ label: 'Month', value: undefined }}
              items={Validation.monthsOptions}
            />
          </View>
          <View style={styling.item}>
            <Field
              name="dateOfBirthDay"
              textInputProps={{ accessibilityLabel: 'dateOfBirthDay' }}
              component={PickerField}
              placeholder={{ label: 'Day', value: undefined }}
              items={Validation.datesOptions}
            />
          </View>
          <View style={styling.item}>
            <Field
              name="dateOfBirthYear"
              textInputProps={{ accessibilityLabel: 'dateOfBirthYear' }}
              component={PickerField}
              placeholder={{ label: 'Year', value: undefined }}
              items={Validation.yearsOptions}
            />
          </View>
        </View>
        <View style={styling.row}>
          <Field
            name="gender"
            textInputProps={{ accessibilityLabel: 'gender' }}
            component={PickerField}
            placeholder={{ label: 'Your Gender', value: undefined }}
            items={Validation.genderOptions}
          />
        </View>
        <View style={styling.row}>
          <Field
            name="fullName"
            component={TextField}
            placeholder={t('Your Full Name')}
            accessibilityLabel="fullName"
          />
        </View>
        <View style={styling.row}>
          <Field name="bio" component={TextField} placeholder={t('Bio')} accessibilityLabel="bio" />
        </View>

        <Title style={styling.title}>{t('Match Settings')}</Title>
        <View style={[styling.row, styling.group]}>
          <View style={styling.item}>
            <Field
              name="matchAgeRangeMin"
              textInputProps={{ accessibilityLabel: 'matchAgeRangeMin' }}
              component={PickerField}
              placeholder={{ label: 'Match Minimum Age', value: undefined }}
              items={Validation.minAgeOptions}
            />
          </View>
          <View style={styling.item}>
            <Field
              name="matchAgeRangeMax"
              textInputProps={{ accessibilityLabel: 'matchAgeRangeMax' }}
              component={PickerField}
              placeholder={{ label: 'Match Maximum Age', value: undefined }}
              items={Validation.getMaxAgeOptions(values.matchAgeRangeMin)}
            />
          </View>
        </View>
        <View style={styling.row}>
          <Field
            name="matchGenders"
            textInputProps={{ accessibilityLabel: 'matchGenders' }}
            component={PickerField}
            placeholder={{ label: 'Match Gender', value: undefined }}
            items={Validation.genderOptions}
          />
        </View>
        <View style={styling.row}>
          <Field
            name="matchLocationRadius"
            textInputProps={{ accessibilityLabel: 'matchLocationRadius' }}
            component={PickerField}
            placeholder={{ label: 'Match Location Range', value: undefined }}
            items={Validation.locationOptions}
          />
        </View>
        <View style={styling.row}>
          <Field name="location" component={MapField} placeholder={t('Match Location')} accessibilityLabel="location" />
        </View>
      </View>
      <View style={styling.footer}>
        <Title style={styling.title}>{t('Toggle Dating')}</Title>
        <View style={styling.switch}>
          <Text style={styling.label}>{t('Disable Dating')}</Text>
          <Switch value={disableDating} onValueChange={toggleDatingStatusRequest} accessibilityLabel="disableDating" />
        </View>
      </View>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {},
    input: {
      marginBottom: 6,
    },
    group: {
      flexDirection: 'row',
      marginHorizontal: -6,
    },
    row: {
      marginBottom: 12,
    },
    item: {
      flex: 1,
      marginHorizontal: 6,
    },
    title: {
      fontSize: 12,
      textTransform: 'uppercase',
      color: '#8D9195',
    },
    switch: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      flexGrow: 1,
      marginRight: 12,
    },
    inner: {
      padding: theme.spacing.base,
    },
    footer: {
      padding: theme.spacing.base,
      backgroundColor: theme.colors.backgroundSecondary,
    },
  })

DatingSettingsForm.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  handleSubmit: PropTypes.func,
  values: PropTypes.any,
  loading: PropTypes.bool,
  disableDating: PropTypes.bool,
  toggleDatingStatusRequest: PropTypes.func,
}

DatingSettingsForm.defaultProps = {
  loading: false,
  disableDating: false,
}

export default withTranslation()(
  withTheme(({ handleFormSubmit, formInitialValues, formSubmitLoading, ...props }) => (
    <Formik
      initialValues={formInitialValues}
      validationSchema={formSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {(formikProps) => <DatingSettingsForm {...props} {...formikProps} loading={formSubmitLoading} />}
    </Formik>
  )),
)
