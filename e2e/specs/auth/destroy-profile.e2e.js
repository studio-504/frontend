import * as actions from './actions'
import { permissions } from '../../helpers/users'
import { toBeVisible, tap, scrollTo, tapToText } from '../../helpers/utils'
import * as emailHelpers from '../../helpers/email'
import {
  Navigation,
  ThemeDefaultScreen,
  FeedScreen,
  ProfileScreen,
  SettingsScreen,
  AuthHomeScreen,
  AuthSigninEmail,
} from './../../helpers/screens'

describe('Feature: Destroy profile', () => {
  let user

  beforeAll(async () => {
    await device.launchApp({ permissions, newInstance: true })
    user = await actions.signUp()
    await emailHelpers.emptyInbox(user.inbox.id)
  })

  afterAll(async () => {
    await emailHelpers.deleteInbox(user.inbox.id)
  })

  describe('destroy the profile', () => {
    it('should close theme selector', async () => {
      await tap(ThemeDefaultScreen.backdrop)
      await toBeVisible(FeedScreen.root)
    })

    it('should navigate to profile screen', async () => {
      await tap(Navigation.tabNavigator.profile)
      await toBeVisible(ProfileScreen.root)
    })

    it('should navigate to settings screen', async () => {
      await tap(ProfileScreen.actions.settingsBtn)
      await toBeVisible(SettingsScreen.root)
    })

    it('should scroll to bottom', async () => {
      await scrollTo(SettingsScreen.root, 'bottom')
      await toBeVisible(SettingsScreen.actions.deleteProfileBtn)
    })

    it('should delete the profile', async () => {
      await tap(SettingsScreen.actions.deleteProfileBtn)
      await tapToText('Delete now')
      await toBeVisible(AuthHomeScreen.root)
    })
  })

  describe('try to signin to destroyed profile', () => {
    it('should fail', async () => {
      await actions.signIn({
        email: user.email,
        password: user.password,
      })
      await toBeVisible(AuthSigninEmail.root)
    })
  })

})
