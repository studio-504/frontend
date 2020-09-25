import React from 'react'
import PropTypes from 'prop-types'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native'
import { Text, withTheme } from 'react-native-paper'
import DiamondHeaderIcon from 'assets/svg/membership/Diamond'
import ProfileIcon from 'assets/svg/membership/Profile'
import DatingIcon from 'assets/svg/membership/Dating'
import ThemesIcon from 'assets/svg/membership/Themes'
import SupportIcon from 'assets/svg/membership/Support'
import DiamondIcon from 'assets/svg/settings/Diamond'
import AppleIcon from 'assets/svg/auth/Apple'
import color from 'color'
import DefaultButton from 'components/Formik/Button/DefaultButton'

import { withTranslation } from 'react-i18next'

const Membership = ({
  t,
  theme,
  requestSubscription,
  cancelSubscription,
  isSubscribed,
  isSubmitting,
}) => {
  const styling = styles(theme)
  
  return (
    <ScrollView style={styling.root}>
      <SafeAreaView style={styling.component}>
        <View style={styling.heading}>
          <View style={styling.info}>
            <DiamondHeaderIcon fill={theme.colors.text} />
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
            <Text style={styling.subheadingSubtitle}>{t('Boost your profile in trending photos')}</Text>
          </View>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingIcon}>
            <DatingIcon fill={theme.colors.text} />
          </View>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingTitle}>{t('Dating Match Boost')}</Text>
            <Text style={styling.subheadingSubtitle}>{t('Send your profile to the top of potential matchess')}</Text>
          </View>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingIcon}>
            <ThemesIcon fill={theme.colors.text} />
          </View>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingTitle}>{t('Profile Themes')}</Text>
            <Text style={styling.subheadingSubtitle}>{t('Change the appearance of your profile')}</Text>
          </View>
        </View>

        <View style={styling.subheading}>
          <View style={styling.subheadingIcon}>
            <SupportIcon fill={theme.colors.text} />
          </View>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingTitle}>{t('Live Chat Support')}</Text>
            <Text style={styling.subheadingSubtitle}>{t('We\'re here to help!')}</Text>
          </View>
        </View>

        <View style={[styling.subheading, styling.lastChild]}>
          <View style={styling.subheadingIcon}>
            <DiamondIcon fill={theme.colors.text} />
          </View>
          <View style={styling.subheadingContent}>
            <Text style={styling.subheadingTitle}>{t('Diamond Badge')}</Text>
            <Text style={styling.subheadingSubtitle}>{t('A shiny badge next to your username')}</Text>
          </View>
        </View>

        <View style={styling.action}>
          {isSubscribed ? (
            <DefaultButton labelStyle={styling.unsubscribeBtnLabel} mode="outlined" label={t('Unsubscribe')} onPress={cancelSubscription} />
          ) : (
            <>
            <Text style={styling.descriptionText}>{t('Become a member today')}</Text>
            <DefaultButton
              labelStyle={styling.labelStyle}
              label={t('Subscribe for $9.99 month')}
              icon={AppleIcon}
              onPress={requestSubscription}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
            </>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  ) 
}

const styles = theme => StyleSheet.create({
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
  action: {
    paddingHorizontal: theme.spacing.base,
  },
  labelStyle: {
    marginLeft: 12,
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
  lastChild: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '300',
    paddingBottom: 6,
    textAlign: 'center',
  },
  unsubscribeBtnLabel: {
    color: theme.colors.text,
  },
})

Membership.propTypes = {
  t: PropTypes.any,
  theme: PropTypes.any,
  isSubscribed: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  requestSubscription: PropTypes.func,
  cancelSubscription: PropTypes.func,
}

Membership.defaultProps = {
  isSubscribed: false,
  isSubmitting: false
}

export default withTranslation()(withTheme(Membership))
