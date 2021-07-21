import { credentials, permissions } from '../../helpers/users'
import { toBeVisible, tap, typeText } from '../../helpers/utils'
import {
  Navigation,
  ThemeDefaultScreen,
  FeedScreen,
  AuthHomeScreen,
  ProfileUpgradeScreen,
  AuthSigninEmail,
} from './../../helpers/screens'

describe('Feature: Sign in anonymously', () => {
  beforeAll(async () => {
    await device.launchApp({ permissions, newInstance: true })
  })

  describe('Scenario: sign in anonymously', () => {
    it('When app is opened', async () => {
      await toBeVisible(AuthHomeScreen.root)
    })

    it('Then sign in anonymously', async () => {
      await tap(AuthHomeScreen.actions.anonymousBtn)
      await tap(ThemeDefaultScreen.backdrop)
      await toBeVisible(FeedScreen.root)
    })
  })

  describe('Scenario: sign in with existing account', () => {
    it('Given: auth modal', async () => {
      await tap(Navigation.tabNavigator.profile)
      await toBeVisible(ProfileUpgradeScreen.root)
    })

    it('Then open sign in with e-mail screen', async () => {
      await tap(ProfileUpgradeScreen.actions.signInBtn)
      await tap(Navigation.authNavigator.signIn.email)
      await toBeVisible(AuthSigninEmail.root)
    })

    it('Then sign in with existing account', async () => {
      await typeText(AuthSigninEmail.form.email, credentials.email)
      await typeText(AuthSigninEmail.form.password, credentials.password)
      await tap(AuthSigninEmail.form.submitBtn)
      await toBeVisible(FeedScreen.root)
    })
  })
})
