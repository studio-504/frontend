import React from 'react'
import PropTypes from 'prop-types'
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native'
import { Text } from 'react-native-paper'
import DiamondIcon from 'assets/svg/membership/Diamond'
import ProfileIcon from 'assets/svg/membership/Profile'
import DatingIcon from 'assets/svg/membership/Dating'
import ThemesIcon from 'assets/svg/membership/Themes'
import SupportIcon from 'assets/svg/membership/Support'
import AppleIcon from 'assets/svg/auth/Apple'
import * as navigationActions from 'navigation/actions'
import color from 'color'
import DefaultButton from 'components/Formik/Button/DefaultButton'

import { withTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { withTranslation } from 'react-i18next'

const Membership = ({
  t,
  theme,
  requestSubscription,
}) => {
  const styling = styles(theme)
  const navigation = useNavigation()

  return (
    <ScrollView style={styling.root}>
      <TouchableOpacity style={styling.backdrop} onPress={navigationActions.navigateBack(navigation)} />
    
      <SafeAreaView style={styling.component}>
        <View style={styling.heading}>
          <View style={styling.info}>
            <DiamondIcon fill={theme.colors.text} />
          </View>
          <Text style={styling.headingTitle}>{t('REAL Diamond')}</Text>
          <Text style={styling.headingSubtitle}>{t('Membership Perks')}</Text>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingIcon}>
            <ProfileIcon fill={theme.colors.text} />
          </View>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingTitle}>{t('Profile Trending Boost')}</Text>
            <Text style={styling.subheadingSubtitle}>
              {t('Boost your profile in trending photos')}
            </Text>
          </View>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingIcon}>
            <DatingIcon fill={theme.colors.text} />
          </View>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingTitle}>{t('Dating Match Boost')}</Text>
            <Text style={styling.subheadingSubtitle}>
              {t('Boost your profile in dating app')}
            </Text>
          </View>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingIcon}>
            <ThemesIcon fill={theme.colors.text} />
          </View>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingTitle}>{t('Profile Themes')}</Text>
            <Text style={styling.subheadingSubtitle}>
              {t('Custom per user themes')}
            </Text>
          </View>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingIcon}>
            <SupportIcon fill={theme.colors.text} />
          </View>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingTitle}>{t('24/7 Live Chat Support')}</Text>
            <Text style={styling.subheadingSubtitle}>
              {t('Anytime support agent available')}
            </Text>
          </View>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingIcon}>
            <DiamondIcon fill={theme.colors.text} />
          </View>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingTitle}>{t('Diamond Emblem')}</Text>
            <Text style={styling.subheadingSubtitle}>
              {t('Get shiny diamond emblem')}
            </Text>
          </View>
        </View>

        <View style={styling.description}>
          <Text style={styling.descriptionText}>{t('Become a member today')}</Text>
        </View>

        <View style={styling.action}>
          <DefaultButton label={t('Subscribe for $9.99 month')} icon={AppleIcon} onPress={requestSubscription} />
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = theme => StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
  },
  component: {
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
  action: {
    paddingHorizontal: theme.spacing.base,
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
    color: color(theme.colors.text).fade(.4),
    textAlign: 'center',
  },
  subheadingIcon: {
    paddingRight: 24,
    paddingTop: 6,
  },
  subheadingContent: {
    flex: 1,
  },
  subheadingTitle: {
    fontSize: 15,
    paddingBottom: 6,
    fontWeight: '500',
  },
  subheadingSubtitle: {
    fontWeight: '400',
    color: color(theme.colors.text).fade(.4),
  },
  strong: {
    fontWeight: '500',
    color: color(theme.colors.text).fade(.4),
  },
  description: {
    paddingHorizontal: 48,
    paddingVertical: 24,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '300',
    paddingBottom: 6,
    textAlign: 'center',
  },
})

Membership.propTypes = {
  theme: PropTypes.any,
  t: PropTypes.any,
  handleBackAction: PropTypes.any,
  handleHideAction: PropTypes.any,
  handleHomeAction: PropTypes.any,
  requestSubscription: PropTypes.func,
}

export default withTranslation()(withTheme(Membership))
