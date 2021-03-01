import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'

const ToggleButton = ({ theme, value, onChange, options }) => {
  const styling = styles(theme, options.length)

  return (
    <View style={styling.row} accessibilityRole="radiogroup" accessibilityLabel="Toggle Button">
      {options.map((item, index) => {
        const selected = item.value === value

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={styling.item}
            onPress={() => onChange(item.value)}
            disabled={selected}
          >
            <Text style={[styling.label, selected ? styling.selected : null]} numberOfLines={1} ellipsizeMode="tail">
              {item.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = (theme, count) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      borderRadius: 4,
      borderColor: theme.colors.border,
      borderWidth: 1,
      marginBottom: 10,
      backgroundColor: theme.colors.backgroundPrimary,
      padding: 2,
    },
    item: {
      flex: count,
    },
    label: {
      color: theme.colors.border,
      borderRadius: 2,
      overflow: 'hidden',
      textAlign: 'center',
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    selected: {
      backgroundColor: theme.colors.primary,
      color: 'white',
    },
  })

ToggleButton.propTypes = {
  theme: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string.isRequired,
    }),
  ),
}

ToggleButton.defaultProps = {
  options: [],
}

export default withTheme(ToggleButton)
