import * as actions from '../../helpers/actions/authActions'
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

  describe('Scenario: destroy profile', () => {
    it('Given: feed screen', async () => {
      await tap(ThemeDefaultScreen.backdrop)
      await toBeVisible(FeedScreen.root)
    })

    it('Then navigate to profile screen', async () => {
      await tap(Navigation.tabNavigator.profile)
      await toBeVisible(ProfileScreen.root)
    })

    it('Then navigate to settings screen', async () => {
      await tap(ProfileScreen.actions.settingsBtn)
      await toBeVisible(SettingsScreen.root)
    })

    it('Then scroll to bottom', async () => {
      await scrollTo(SettingsScreen.root, 'bottom')
      await toBeVisible(SettingsScreen.actions.deleteProfileBtn)
    })

    it('Then tap to delete the profile button and confirm', async () => {
      await tap(SettingsScreen.actions.deleteProfileBtn)
      await tapToText('Delete now')
      await toBeVisible(AuthHomeScreen.root)
    })
  })

  describe('Scenario: try to signin to destroyed profile', () => {
    it('Fail with sign in to destroyed profile', async () => {
      await actions.signIn({
        email: user.email,
        password: user.password,
      })
      await toBeVisible(AuthSigninEmail.root)
    })
  })
})
