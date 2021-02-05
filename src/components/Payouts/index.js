import React from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native'
import color from 'color'
import { Text, withTheme } from 'react-native-paper'
import WalletIcon from 'assets/svg/payouts/Wallet'
import { withTranslation } from 'react-i18next'

const Payouts = ({ t, theme }) => {
  const styling = styles(theme)

  return (
    <ScrollView style={styling.root}>
      <SafeAreaView style={styling.component}>
        <View style={styling.heading}>
          <View style={styling.info}>
            <WalletIcon fill={theme.colors.text} />
          </View>
          <Text style={styling.headingTitle}>{t('Creator Payouts')}</Text>
          <Text style={styling.headingSubtitle}>{t('Coming Soon')}</Text>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingSubtitle}>
              {t(
                'Once live, Diamond members will start to see money appear in their wallet for each view they receive from other members',
              )}
            </Text>
          </View>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingSubtitle}>
              {t(
                'Creators are also welcome to do disclosed paid partnerships. REAL supports links in post captions & your bio!',
              )}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    info: {
      alignItems: 'center',
      paddingBottom: 12,
    },
    heading: {
      paddingHorizontal: 48,
      paddingVertical: 24,
    },
    subheading: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
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
    subheadingContent: {
      flex: 1,
    },
    subheadingSubtitle: {
      fontWeight: '400',
      color: color(theme.colors.text).fade(0.4).string(),
    },
  })

Payouts.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
}

export default withTranslation()(withTheme(Payouts))
