import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import SuccessIcon from 'assets/svg/collapsable/Success'

function ProgressTabBar({ theme, onChange, state, descriptors }) {
  const styling = styles(theme)

  const makeStyles = ({ isActive, isStepDone }) => ({
    label: [styling.label, isActive ? styling.labelActive : null, isStepDone ? styling.labelDone : null],
    number: [styling.number, isActive ? styling.numberActive : null, isStepDone ? styling.numberDone : null],
    numberText: [styling.numberText, isActive ? styling.numberTextActive : null],
  })

  return (
    <View style={styling.root}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const number = index + 1
        const label = options.tabBarLabel
        const isActive = state.index === index
        const isLastStep = number === state.routes.length
        const isStepDone = index < state.index
        const itemStyles = makeStyles({ isActive, isStepDone })
        const onPress = () => onChange(route.name)

        return (
          <React.Fragment key={index}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isActive ? { selected: true } : {}}
              style={styling.button}
              onPress={onPress}
              disabled={isActive || !isStepDone}
            >
              <View style={itemStyles.number}>
                {isStepDone ? (
                  <SuccessIcon fill="#ffffff" />
                ) : (
                  <Text style={itemStyles.numberText}>{number}</Text>
                )}
              </View>
              <Text style={itemStyles.label} numberOfLines={1}>
                {label}
              </Text>
            </TouchableOpacity>
            {isLastStep === false ? <View style={styling.divider}></View> : null}
          </React.Fragment>
        )
      })}
    </View>
  )
}

ProgressTabBar.propTypes = {
  theme: PropTypes.any, 
  onChange: PropTypes.func, 
  state: PropTypes.any, 
  descriptors: PropTypes.any,
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flexDirection: 'row',
      marginHorizontal: 12,
      marginVertical: 12,
    },
    button: {
      alignItems: 'center',
      flex: 1.2,
      flexShrink: 1,
    },
    number: {
      width: 32,
      height: 32,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: 32 / 2,
      marginBottom: 4,
      flexShrink: 0,
      paddingTop: 4,
      overflow: 'hidden',
    },
    label: {
      color: theme.colors.border,
      textAlign: 'center',
      flexShrink: 1,
    },
    divider: {
      flex: 1,
      height: 4,
      backgroundColor: theme.colors.border,
      borderRadius: 2,
      marginHorizontal: 4,
      marginTop: 14,
    },
    labelActive: {
      color: theme.colors.text,
      fontWeight: '600',
    },
    numberActive: {
      borderColor: theme.colors.text,
      color: theme.colors.text,
    },
    numberDone: {
      paddingTop: 0,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    numberText: {
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
      color: theme.colors.border,
    },
    numberTextActive: {
      color: theme.colors.text,
    },
  })

export default withTheme(ProgressTabBar)
