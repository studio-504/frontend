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
  height: Validation.height,
  matchAgeRangeMin: Validation.matchAgeRangeMin,
  matchAgeRangeMax: Validation.matchAgeRangeMax,
  matchLocationRadius: Validation.matchLocationRadius,
  matchGenders: Validation.matchGenders,
  matchHeightRangeMin: Validation.height,
  matchHeightRangeMax: Validation.height,
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
              accessibilityLabel="dateOfBirthMonth"
              label={t('Month')}
              component={PickerField}
              placeholder={{ label: 'Month', value: undefined }}
              items={Validation.monthsOptions}
            />
          </View>
          <View style={styling.item}>
            <Field
              name="dateOfBirthDay"
              accessibilityLabel="dateOfBirthDay"
              label={t('Day')}
              component={PickerField}
              placeholder={{ label: 'Day', value: undefined }}
              items={Validation.datesOptions}
            />
          </View>
          <View style={styling.item}>
            <Field
              name="dateOfBirthYear"
              accessibilityLabel="dateOfBirthYear"
              label={t('Year')}
              component={PickerField}
              placeholder={{ label: 'Year', value: undefined }}
              items={Validation.yearsOptions}
            />
          </View>
        </View>
        <View style={styling.row}>
          <Field
            name="gender"
            accessibilityLabel="gender"
            component={PickerField}
            label={t('Your Gender')}
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
        <View style={styling.row}>
          <Field
            name="height"
            accessibilityLabel="height"
            component={PickerField}
            label={t('Height')}
            placeholder={{ label: 'Height', value: undefined }}
            items={Validation.heightOptions}
          />
        </View>

        <Title style={styling.title}>{t('Match Settings')}</Title>
        <View style={[styling.row, styling.group]}>
          <View style={styling.item}>
            <Field
              name="matchAgeRangeMin"
              accessibilityLabel="matchAgeRangeMin"
              component={PickerField}
              label={t('Minimum Age')}
              placeholder={{ label: 'Minimum Age', value: undefined }}
              items={Validation.minAgeOptions}
            />
          </View>
          <View style={styling.item}>
            <Field
              name="matchAgeRangeMax"
              accessibilityLabel="matchAgeRangeMax"
              component={PickerField}
              label={t('Maximum Age')}
              placeholder={{ label: 'Maximum Age', value: undefined }}
              items={Validation.getMaxAgeOptions(values.matchAgeRangeMin)}
            />
          </View>
        </View>
        <View style={[styling.row, styling.group]}>
          <View style={styling.item}>
            <Field
              name="matchHeightRangeMin"
              accessibilityLabel="matchHeightRangeMin"
              component={PickerField}
              label={t('Minimum Height')}
              placeholder={{ label: 'Minimum Height', value: undefined }}
              items={Validation.heightOptions}
            />
          </View>
          <View style={styling.item}>
            <Field
              name="matchHeightRangeMax"
              accessibilityLabel="matchHeightRangeMax"
              component={PickerField}
              label={t('Maximum Height')}
              placeholder={{ label: 'Maximum Height', value: undefined }}
              items={Validation.heightOptions}
            />
          </View>
        </View>
        <View style={styling.row}>
          <Field
            name="matchGenders"
            accessibilityLabel="matchGenders"
            component={PickerField}
            label={t('Gender')}
            placeholder={{ label: 'Gender', value: undefined }}
            items={Validation.genderOptions}
          />
        </View>
        <View style={styling.row}>
          <Field
            name="matchLocationRadius"
            accessibilityLabel="matchLocationRadius"
            component={PickerField}
            label={t('Location Range')}
            placeholder={{ label: 'Location Range', value: undefined }}
            items={Validation.locationOptions}
          />
        </View>
        <View style={styling.row}>
          <Field name="location" component={MapField} placeholder={t('Location')} accessibilityLabel="location" />
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
