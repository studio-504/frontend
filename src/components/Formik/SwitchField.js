import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { Text, Switch } from 'react-native-paper'
import propOr from 'ramda/src/propOr'

const SwitchField = ({ label, form, field, accessibilityLabel }) => {
  const onValueChange = (value) => {
    form.setFieldValue(field.name, value)
  }

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={propOr(false, 'value', field)}
        onValueChange={onValueChange}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flexGrow: 1,
    marginRight: 12,
  },
})

SwitchField.propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.bool,
  }).isRequired,
  form: PropTypes.shape({
    handleChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }),
  accessibilityLabel: PropTypes.string,
}

SwitchField.defaultProps = {
  accessibilityLabel: null,
}

export default SwitchField
