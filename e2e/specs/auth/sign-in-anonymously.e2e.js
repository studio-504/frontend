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

  describe('sign in anonymously', () => {
    it('should sign in anonymously', async () => {
      await tap(AuthHomeScreen.actions.anonymousBtn)
      await tap(ThemeDefaultScreen.backdrop)
      await toBeVisible(FeedScreen.root)
    })

    it('should open auth modal', async () => {
      await tap(Navigation.tabNavigator.profile)
      await toBeVisible(ProfileUpgradeScreen.root)
    })
  })

  describe('sign in with real profile', () => {
    it('should navigate login form', async () => {
      await tap(ProfileUpgradeScreen.actions.signInBtn)
      await tap(Navigation.authNavigator.signIn.email)
      await toBeVisible(AuthSigninEmail.root)
    })

    it('should sign in', async () => {
      await typeText(AuthSigninEmail.form.email, credentials.email)
      await typeText(AuthSigninEmail.form.password, credentials.password)
      await tap(AuthSigninEmail.form.submitBtn)
      await toBeVisible(FeedScreen.root)
    })
  })
})
