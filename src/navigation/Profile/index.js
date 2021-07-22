import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ThemeContext } from 'services/providers/Theme'
import * as navigationOptions from 'navigation/options'
import * as navigationFragments from 'navigation/fragments'

import ProfileSelfScreen from 'screens/ProfileSelfScreen'
import ProfileEditScreen from 'screens/ProfileEditScreen'
import ProfilePhotoGridScreen from 'screens/ProfilePhotoGridScreen'
import ProfilePhotoUploadScreen from 'screens/ProfilePhotoUploadScreen'
import ProfilePhotoScreen from 'screens/ProfilePhotoScreen'
import PrivacyScreen from 'screens/PrivacyScreen'
import TranslationScreen from 'screens/TranslationScreen'
import SettingsScreen from 'screens/SettingsScreen'
import PayoutScreen from 'screens/PayoutScreen'
import PromocodesScreen from 'screens/PromocodeScreen'
import ArchivedScreen from 'screens/ArchivedScreen'
import DatingSettingsScreen from 'screens/DatingSettingsScreen'
import DatingMatchScreen from 'screens/DatingMatchScreen'
import DatingAboutScreen from 'screens/DatingAboutScreen'
import DatingProfileScreen from 'screens/DatingProfileScreen'
import ProfileEditTestIDs from 'components/ProfileEdit/test-ids'

const Stack = createStackNavigator()

const ProfileNavigator = () => {
  const { theme } = useContext(ThemeContext)
  const stackNavigatorDefaultProps = navigationOptions.stackNavigatorDefaultProps({ theme })
  const stackScreenPageProps = navigationOptions.stackScreenPageProps({ theme })

  return (
    <Stack.Navigator {...stackNavigatorDefaultProps}>
      <Stack.Screen
        name="ProfileSelf"
        component={ProfileSelfScreen}
        {...stackScreenPageProps({ options: { title: 'Profile' } })}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        {...stackScreenPageProps({
          options: {
            title: 'Edit Profile',
            backButtonTestID: ProfileEditTestIDs.actions.headerBack,
          },
        })}
      />
      <Stack.Screen
        name="ProfilePhotoGrid"
        component={ProfilePhotoGridScreen}
        {...stackScreenPageProps({ options: { title: 'Change Profile Picture' } })}
      />
      <Stack.Screen
        name="ProfilePhotoUpload"
        component={ProfilePhotoUploadScreen}
        {...stackScreenPageProps({ options: { title: 'Change Profile Picture' } })}
      />
      <Stack.Screen
        name="ProfilePhoto"
        component={ProfilePhotoScreen}
        {...stackScreenPageProps({ options: { title: 'Change Profile Picture' } })}
      />

      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        {...stackScreenPageProps({ options: { title: 'Mental Health & Privacy Settings' } })}
      />
      <Stack.Screen
        name="Translation"
        component={TranslationScreen}
        {...stackScreenPageProps({ options: { title: 'Change Language' } })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        {...stackScreenPageProps({ options: { title: 'Settings' } })}
      />
      <Stack.Screen
        name="Payout"
        component={PayoutScreen}
        {...stackScreenPageProps({ options: { title: 'Diamond Payout' } })}
      />
      <Stack.Screen
        name="Promocodes"
        component={PromocodesScreen}
        {...stackScreenPageProps({ options: { title: 'Promocodes' } })}
      />
      <Stack.Screen
        name="Archived"
        component={ArchivedScreen}
        {...stackScreenPageProps({ options: { title: 'Archived Photos' } })}
      />
      <Stack.Screen
        name="DatingSettings"
        component={DatingSettingsScreen}
        {...stackScreenPageProps({ options: { title: 'Dating Preferences' } })}
      />
      <Stack.Screen
        name="DatingMatch"
        component={DatingMatchScreen}
        {...stackScreenPageProps({ options: { title: 'Match Settings' } })}
      />
      <Stack.Screen
        name="DatingAbout"
        component={DatingAboutScreen}
        {...stackScreenPageProps({ options: { title: 'Edit Profile' } })}
      />
      <Stack.Screen
        name="DatingProfile"
        component={DatingProfileScreen}
        {...stackScreenPageProps({ options: { title: 'Preview Profile' } })}
      />
      {navigationFragments.media({
        Stack,
        stackScreenPageProps,
      })}
    </Stack.Navigator>
  )
}

export default ProfileNavigator
