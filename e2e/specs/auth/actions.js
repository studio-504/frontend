import * as emailHelpers from '../../helpers/email'
import { generatePassword, typeText, tap, toBeVisible, sleep } from './../../helpers/utils'
import {
  AuthHomeScreen,
  Navigation,
  ProfileScreen,
  SettingsScreen,
  AuthUsernameScreen,
  AuthSigninEmail,
  AuthEmailConfirmScreen,
  AuthEmailScreen,
  AuthPasswordScreen,
} from './../../helpers/screens'

export async function openSignInForm() {
  await toBeVisible(AuthHomeScreen.root)
  await tap(AuthHomeScreen.footer.signInBtn)
  await tap(Navigation.authNavigator.signIn.email)
}

export async function submitSignInForm(credentials) {
  await typeText(AuthSigninEmail.form.email, credentials.email)
  await typeText(AuthSigninEmail.form.password, credentials.password)
  await tap(AuthSigninEmail.form.submitBtn)
}

export async function signIn(credentials) {
  await openSignInForm()
  await submitSignInForm(credentials)
}

export async function signUp() {
  const password = generatePassword()
  const inbox = await emailHelpers.createInbox()
  const email = inbox.emailAddress

  await tap(AuthHomeScreen.actions.signUpBtn)
  await tap(Navigation.authNavigator.signUp.email)
  await typeText(AuthEmailScreen.form.email, email)
  await tap(AuthEmailScreen.form.submitBtn)
  await toBeVisible(AuthEmailConfirmScreen.root)

  await sleep(10000)
  const confirmationCode = await emailHelpers.extractCodeFromLatestEmail(inbox.id)
  await typeText(AuthEmailConfirmScreen.form.confirmationCode, confirmationCode)
  await tap(AuthEmailConfirmScreen.form.confirmButton)
  await toBeVisible(AuthUsernameScreen.root)

  await tap(AuthUsernameScreen.header.skipBtn)
  await toBeVisible(AuthPasswordScreen.root)

  await typeText(AuthPasswordScreen.form.password, password)
  await tap(AuthPasswordScreen.form.submitBtn)

  return { password, inbox, email }
}

export async function signOut() {
  await toBeVisible(Navigation.tabNavigation.profile)
  await tap(Navigation.tabNavigation.profile)
  await toBeVisible(ProfileScreen.root)

  await tap(ProfileScreen.actions.settingsBtn)
  await toBeVisible(SettingsScreen.root)

  await tap(SettingsScreen.actions.signOutBtn)
}
