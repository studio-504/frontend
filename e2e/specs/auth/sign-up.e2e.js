import * as emailHelpers from '../../helpers/email'
import { credentials, permissions } from '../../helpers/users'
import { generateString, tap, toBeVisible, toBeNotVisible, sleep } from '../../helpers/utils'
import {
  AuthHomeScreen,
  AuthUsernameScreen,
  AuthEmailConfirmScreen,
  AuthEmailScreen,
  AuthPhoneScreen,
  AuthPasswordScreen,
  Navigation,
} from './../../helpers/screens'
import { describe } from 'jest-circus'

async function getFields() {
  return {
    username: element(by.id(AuthUsernameScreen.form.username)),
    password: element(by.id(AuthPasswordScreen.form.password)),
    email: element(by.id(AuthEmailScreen.form.email)),
    code: element(by.id(AuthEmailConfirmScreen.form.confirmationCode)),
  }
}

async function fillField(name, value) {
  const fields = await getFields()
  const field = fields[name]

  await field.clearText()
  await field.typeText(value)
}

async function testField(field, value, step, tapTo) {
  await field.clearText()
  await field.typeText(value)

  if (tapTo) {
    await sleep(500)
    await tap(tapTo)
  }

  await shouldStayOnStep(step)
}

async function shouldStayOnStep(step) {
  if (step === 'phone') {
    await tap(AuthPhoneScreen.form.submitBtn)
    await toBeVisible(AuthPhoneScreen.root)
  } else if (step === 'password') {
    await toBeVisible(AuthPasswordScreen.root)
  } else if (step === 'email') {
    await toBeVisible(AuthEmailScreen.root)
  } else if (step === 'code') {
    await toBeVisible(AuthEmailConfirmScreen.root)
  } else if (step === 'username') {
    await toBeVisible(AuthUsernameScreen.root)
  }
}

describe('Feature: Sign up', () => {
  let inbox

  beforeAll(async () => {
    inbox = await emailHelpers.createInbox()

    await device.launchApp({ permissions, newInstance: true })
  })

  afterAll(async () => {
    await emailHelpers.deleteInbox(inbox.id)
  })

  describe('Scenario: Signup with incorrect inputs', () => {
    let email

    beforeAll(async () => {
      const fields = await getFields()
      email = fields.email
    })

    describe('Scenario: e-mail signup fails', () => {
      it('Given: navigated to signup screen', async () => {
        await toBeVisible(AuthHomeScreen.root)
        await tap(AuthHomeScreen.actions.signUpBtn)
        await tap(Navigation.authNavigator.signUp.email)
        await toBeVisible(AuthEmailScreen.root)
      })

      it('Then fail with invalid e-mail addresses', async () => {
        await testField(email, 'notvalid', 'email', AuthEmailScreen.form.submitBtn)
        await testField(email, 'notvalid@', 'email', AuthEmailScreen.form.submitBtn)
        await testField(email, 'notvalid@email', 'email', AuthEmailScreen.form.submitBtn)
        await testField(email, 'notvalid@email.', 'email', AuthEmailScreen.form.submitBtn)
        await shouldStayOnStep('email')
      })

      it('Then fail with existing e-mail adress', async () => {
        await fillField('email', credentials.email)
        await tap(AuthEmailScreen.form.submitBtn)
        await shouldStayOnStep('email')
      })
    })
  })

  describe('Scenario: signup with correct credentials', () => {
    let username
    let password

    beforeAll(async () => {
      const fields = await getFields()
      username = fields.username
      password = fields.password
    })

    describe('Scenario: signup with e-mail and confirm the e-mail', () => {
      it('Given: auth screen with e-mail', async () => {
        await toBeVisible(AuthEmailScreen.root)
      })

      it('Then enter the e-mail and submit', async () => {
        await fillField('email', inbox.emailAddress)
        await tap(AuthEmailScreen.form.submitBtn)
        await toBeVisible(AuthEmailConfirmScreen.root)
      })

      it('Then confirm the e-mail', async () => {
        await sleep(10000)
        const confirmationCode = await emailHelpers.extractCodeFromLatestEmail(inbox.id)
        await fillField('code', confirmationCode)
        await tap(AuthEmailConfirmScreen.form.confirmButton)
        await toBeVisible(AuthUsernameScreen.root)
      })
    })

    describe('Given: auth username screen', () => {
      it('Then fail with invalid characters', async () => {
        await testField(username, '!', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '&', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '#', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '*', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '@', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '|', 'username', AuthUsernameScreen.form.submitBtn)
        await shouldStayOnStep('username')
      })

      it('Then fail with existing username', async () => {
        await testField(username, 'real', 'username', AuthUsernameScreen.form.submitBtn)
        await shouldStayOnStep('username')
      })

      it('Then fail with minimum character length', async () => {
        await testField(username, 'abc', 'username', AuthUsernameScreen.form.submitBtn)
        await shouldStayOnStep('username')
      })

      it('Then fail with maximum character length', async () => {
        await testField(username, generateString({ length: 31 }), 'username', AuthUsernameScreen.form.submitBtn)
        await shouldStayOnStep('username')
      })
    })

    describe('Scenario: skip the username screen', () => {
      it('Then navigate to auth password screen', async () => {
        await tap(AuthUsernameScreen.header.skipBtn)
        await toBeVisible(AuthPasswordScreen.root)
      })
    })

    describe('Scenario: fail with invalid password', () => {
      it('Fail with minimum character length', async () => {
        await testField(password, generateString({ length: 7 }), 'password', AuthPasswordScreen.form.submitBtn)
        await shouldStayOnStep('password')
      })

      it('The fail with maximum character length', async () => {
        await testField(password, generateString({ length: 51 }), 'password', AuthPasswordScreen.form.submitBtn)
        await shouldStayOnStep('password')
      })
    })

    describe('Scenario: set acceptable password', () => {
      it('Set the password and signup', async () => {
        await fillField('password', generateString({ length: 10 }))
        await tap(AuthPasswordScreen.form.submitBtn)
        await toBeNotVisible(AuthUsernameScreen.root)
      })
    })
  })
})
