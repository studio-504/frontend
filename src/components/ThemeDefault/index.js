import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, SafeAreaView, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import NightIcon from 'assets/svg/other/Night'
import color from 'color'
import DefaultButton from 'components/Formik/Button/DefaultButton'
import { withTheme } from 'react-native-paper'
import { withTranslation } from 'react-i18next'
import testIDs from 'components/ThemeDefault/test-ids'

const ThemeDefault = ({ t, theme, handleSkip, handleEnable }) => {
  const styling = styles(theme)

  return (
    <View style={styling.root}>
      <TouchableOpacity testID={testIDs.backdrop} style={styling.backdrop} onPress={handleSkip} />

      <SafeAreaView style={styling.component}>
        <View style={styling.heading}>
          <View style={styling.info}>
            <NightIcon fill={theme.colors.text} />
          </View>
          <Text style={styling.headingTitle}>{t('Dark Mode')}</Text>
          <Text style={styling.headingSubtitle}>
            {t('You can select any theme later in profile settings')}
          </Text>
        </View>

        <View style={styling.footer}>
          <DefaultButton label={t('Enable')} onPress={handleEnable} style={styling.primaryBtn} />
          <DefaultButton label={t('Skip')} onPress={handleSkip} mode="outlined" />
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
    },
    component: {
      borderRadius: 24,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    info: {
      alignItems: 'center',
      paddingBottom: 12,
    },
    heading: {
      paddingHorizontal: 48,
      paddingVertical: 24,
    },
    headingTitle: {
      fontSize: 22,
      fontWeight: '600',
      paddingBottom: 6,
      textAlign: 'center',
    },
    headingSubtitle: {
      fontSize: 16,
      fontWeight: '400',
      color: color(theme.colors.text).fade(0.4).string(),
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: theme.spacing.base * 2,
      marginBottom: theme.spacing.base,
    },
    primaryBtn: {
      marginBottom: theme.spacing.base,
    },
  })

ThemeDefault.propTypes = {
  theme: PropTypes.any,
  t: PropTypes.any,
  handleSkip: PropTypes.any,
  handleEnable: PropTypes.func,
}

export default withTranslation()(withTheme(ThemeDefault))
