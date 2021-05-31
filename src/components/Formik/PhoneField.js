import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import TextInput from 'components/TextInput'
import TextField from 'components/Formik/TextField'
import CountryPicker from 'react-native-country-picker-modal'
import { withTheme } from 'react-native-paper'

const PhoneField = ({ theme, ...props }) => {
  const [countryCode, setCountryCode] = useState('US')
  const styling = styles(theme)

  /**
   * Manually updating country when new country code selected
   */
  const onSelectCountry = (country) => {
    setCountryCode(country.cca2)
    props.form.setFieldValue('countryCode', `+${country.callingCode[0]}`)
  }

  return (
    <View style={styling.root}>
      <View style={styling.flag}>
        <CountryPicker
          countryCode={countryCode}
          onSelect={onSelectCountry}
          modalProps={{ ariaHideApp: false }}
          withFlag
          withCallingCode
          withCallingCodeButton
          withCloseButton={false}
          withEmoji
          withFilter
          withModal
        />
      </View>
      <View style={styling.input}>
        <TextField {...props} />
      </View>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flexDirection: 'row',
    },
    input: {
      flex: 1,
    },
    flag: {
      backgroundColor: theme.colors.backgroundSecondary,
      paddingHorizontal: 6,
      borderRadius: 2,
      height: 40,
      marginRight: 10,
    },
  })

PhoneField.propTypes = {
  field: PropTypes.any,
  form: PropTypes.any,
}

export default withTheme(PhoneField)
