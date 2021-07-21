import * as actions from '../../helpers/actions/authActions'
import { permissions } from '../../helpers/users'
import { generatePassword, toBeVisible, tap, typeText, toHaveValue, toBeNotVisible } from '../../helpers/utils'
import * as emailHelpers from '../../helpers/email'
import {
  AuthSigninEmail,
  AuthForgotConfirmScreen,
  AuthForgotEmailScreen,
  Navigation,
  AuthEmailConfirmScreen,
} from './../../helpers/screens'

describe('Feature: Password Recovery', () => {
  let user

  beforeAll(async () => {
    await device.launchApp({ permissions, newInstance: true })
    user = await actions.signUp()
    await emailHelpers.emptyInbox(user.inbox.id)
  })

  afterAll(async () => {
    await emailHelpers.deleteInbox(user.inbox.id)
  })

  describe('Scenario: recover the password', () => {
    const newPassword = generatePassword()

    it('Given: sign in with e-mail screen', async () => {
      await device.launchApp({ permissions, delete: true, newInstance: true })
      await actions.openSignInForm()
      await toBeVisible(AuthSigninEmail.root)
    })

    it('Then navigate to forgot password of e-mail screen', async () => {
      await tap(AuthSigninEmail.resetPasswordBtn)
      await tap(Navigation.authNavigator.forgot.email)
      await toBeVisible(AuthForgotEmailScreen.root)
    })

    it('Then enter the e-mail', async () => {
      await typeText(AuthForgotEmailScreen.form.email, user.email)
      await tap(AuthForgotEmailScreen.form.submitBtn)
      await toBeVisible(AuthForgotConfirmScreen.root)
    })

    // eslint-disable-next-line jest/expect-expect
    it('When: app is navigated to confirm e-mail screen', async () => {
      await toHaveValue(AuthForgotConfirmScreen.form.emailOrPhone, user.email)
    })

    it('Then enter the confirmation code and new password', async () => {
      const confirmationCode = await emailHelpers.extractCodeFromLatestEmail(user.inbox.id)

      await typeText(AuthForgotConfirmScreen.form.confirmationCode, confirmationCode)
      await typeText(AuthForgotConfirmScreen.form.password, newPassword)

      await tap(AuthForgotConfirmScreen.form.submitBtn)
      await toBeVisible(AuthSigninEmail.root)
    })

    // eslint-disable-next-line jest/expect-expect
    it('Then sign in with new password', async () => {
      await actions.submitSignInForm({ email: user.email, password: newPassword })
      await toBeNotVisible(AuthSigninEmail.root)
    })
  })

  describe('As a user I want to be able to open recovery password screen by tap on a link from an email', () => {
    it('Given: Unauthorized user open an app tap by link from an email', async () => {
      const confirmationCode = '971805'
      const url = `https://real.app/confirm/email/us-east-1:92b7abce-860c-4fd9-aeb8-0f3a023a27ba/${confirmationCode}`
      await device.launchApp({ url, permissions, newInstance: true })

      await toBeVisible(AuthEmailConfirmScreen.root)
      await toHaveValue(AuthEmailConfirmScreen.form.confirmationCode, confirmationCode)
    })
  })
})
