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

  describe('Signup with incorrect inputs', () => {
    let email

    beforeAll(async () => {
      const fields = await getFields()
      email = fields.email
    })

    describe('Email signup fails', () => {
      it('should navigate to signup with email screen', async () => {
        await toBeVisible(AuthHomeScreen.root)
        await tap(AuthHomeScreen.actions.signUpBtn)
        await tap(Navigation.authNavigator.signUp.email)
        await toBeVisible(AuthEmailScreen.root)
      })

      it('should fail with invalid email addresses', async () => {
        await testField(email, 'notvalid', 'email', AuthEmailScreen.form.submitBtn)
        await testField(email, 'notvalid@', 'email', AuthEmailScreen.form.submitBtn)
        await testField(email, 'notvalid@email', 'email', AuthEmailScreen.form.submitBtn)
        await testField(email, 'notvalid@email.', 'email', AuthEmailScreen.form.submitBtn)
        await shouldStayOnStep('email')
      })

      it('should fail with existing email', async () => {
        await fillField('email', credentials.email)
        await tap(AuthEmailScreen.form.submitBtn)
        await shouldStayOnStep('email')
      })
    })
  })

  describe('Signup with correct credentials', () => {
    let username
    let password

    beforeAll(async () => {
      const fields = await getFields()
      username = fields.username
      password = fields.password
    })

    describe('Signup with email and confirm', () => {
      it('should show signup with email screen', async () => {
        await toBeVisible(AuthEmailScreen.root)
      })

      it('should navigate to email confirmation screen', async () => {
        await fillField('email', inbox.emailAddress)
        await tap(AuthEmailScreen.form.submitBtn)
        await toBeVisible(AuthEmailConfirmScreen.root)
      })

      it('should confirm the email address', async () => {
        await sleep(10000)
        const confirmationCode = await emailHelpers.extractCodeFromLatestEmail(inbox.id)
        await fillField('code', confirmationCode)
        await tap(AuthEmailConfirmScreen.form.confirmButton)
        await toBeVisible(AuthUsernameScreen.root)
      })
    })

    describe('Username fails', () => {
      it('should fail with invalid characters', async () => {
        await testField(username, '!', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '&', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '#', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '*', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '@', 'username', AuthUsernameScreen.form.submitBtn)
        await testField(username, '|', 'username', AuthUsernameScreen.form.submitBtn)
        await shouldStayOnStep('username')
      })

      it('should fail existing username', async () => {
        await testField(username, 'real', 'username', AuthUsernameScreen.form.submitBtn)
        await shouldStayOnStep('username')
      })

      it('should fail with less than 3 characters', async () => {
        await testField(username, 'abc', 'username', AuthUsernameScreen.form.submitBtn)
        await shouldStayOnStep('username')
      })

      it('should fail with more than 30 characters', async () => {
        await testField(username, generateString({ length: 31 }), 'username', AuthUsernameScreen.form.submitBtn)
        await shouldStayOnStep('username')
      })
    })

    describe('Username skipping', () => {
      it('should skip username screen', async () => {
        await tap(AuthUsernameScreen.header.skipBtn)
        await toBeVisible(AuthPasswordScreen.root)
      })
    })

    describe('Password fails', () => {
      it('should fail with less than 8 characters', async () => {
        await testField(password, generateString({ length: 7 }), 'password', AuthPasswordScreen.form.submitBtn)
        await shouldStayOnStep('password')
      })

      it('should fail with more than 50 characters', async () => {
        await testField(password, generateString({ length: 51 }), 'password', AuthPasswordScreen.form.submitBtn)
        await shouldStayOnStep('password')
      })
    })

    describe('Setting password', () => {
      it('should set password and sign up successfully', async () => {
        await fillField('password', generateString({ length: 10 }))
        await tap(AuthPasswordScreen.form.submitBtn)
        await toBeNotVisible(AuthUsernameScreen.root)
      })
    })
  })
})
