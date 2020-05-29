import * as emailHelpers from './helpers/email'

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({permissions: {camera: 'YES', medialibrary: 'YES', photos: 'YES'}})
  })
  beforeEach(async () => {
    // await device.reloadReactNative()
  })

  /**
   *
   */
  // it('AuthHome', async () => {
  //   await expect(element(by.id('components/AuthHome'))).toBeVisible()
  //   await element(by.id('components/AuthHome/Actions/signin')).tap()
  //   await expect(element(by.id('components/AuthUsername'))).toBeVisible()
  // })

  /**
   *
   */
  // it('AuthUsername', async () => {
  //   await expect(element(by.id('components/AuthUsername'))).toBeVisible()

  //   /**
  //    * Username exists validation 
  //    */
  //   await element(by.id('components/AuthUsername/Form/username')).typeText('real')
  //   await element(by.id('components/AuthUsername/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthPassword'))).toBeNotVisible()

  //   /**
  //    * Username length constraint validation 
  //    */
  //   await element(by.id('components/AuthUsername/Form/username')).clearText()
  //   await element(by.id('components/AuthUsername/Form/username')).typeText('aa')
  //   await element(by.id('components/AuthUsername/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthPassword'))).toBeNotVisible()

  //   /**
  //    * Username chars constraint validation 
  //    */
  //   await element(by.id('components/AuthUsername/Form/username')).clearText()
  //   await element(by.id('components/AuthUsername/Form/username')).typeText('asd-.')
  //   await element(by.id('components/AuthUsername/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthPassword'))).toBeNotVisible()

  //   /**
  //    * Username reservation
  //    */
  //   const username = `detox${Date.now()}`
  //   await element(by.id('components/AuthUsername/Form/username')).clearText()
  //   await element(by.id('components/AuthUsername/Form/username')).typeText(username)
  //   await element(by.id('components/AuthUsername/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthPassword'))).toBeVisible()
  // })

  /**
   *
   */
  // it('AuthPassword', async () => {
  //   await expect(element(by.id('components/AuthPassword'))).toBeVisible()

  //   /**
  //    * Password length constraint validation 
  //    */
  //   await element(by.id('components/AuthPassword/Form/password')).clearText()
  //   await element(by.id('components/AuthPassword/Form/password')).typeText('aa')
  //   await element(by.id('components/AuthPassword/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthPhone'))).toBeNotVisible()

  //   /**
  //    * Password chars constraint validation 
  //    */
  //   await element(by.id('components/AuthPassword/Form/password')).clearText()
  //   await element(by.id('components/AuthPassword/Form/password')).typeText('asd-.')
  //   await element(by.id('components/AuthPassword/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthPhone'))).toBeNotVisible()

  //   /**
  //    * Password reservation
  //    */
  //   const password = `123123123`
  //   await element(by.id('components/AuthPassword/Form/password')).clearText()
  //   await element(by.id('components/AuthPassword/Form/password')).typeText(password)
  //   await element(by.id('components/AuthPassword/Form/submit')).tap()
  //   // await expect(element(by.id('components/AuthPhone'))).toBeVisible()
  // })

  /**
   *
   */
  // it('AuthPhone Registration flow', async () => {
  //   await expect(element(by.id('components/AuthPhone'))).toBeVisible()

  //   /**
  //    * Phone length constraint validation 
  //    */
  //   await element(by.id('components/AuthPhone/Form/phone')).clearText()
  //   await element(by.id('components/AuthPhone/Form/phone')).typeText('aa')
  //   await element(by.id('components/AuthPhone/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthPhoneConfirm'))).toBeNotVisible()

  //   /**
  //    * Phone chars constraint validation 
  //    */
  //   await element(by.id('components/AuthPhone/Form/phone')).clearText()
  //   await element(by.id('components/AuthPhone/Form/phone')).typeText('asd-.')
  //   await element(by.id('components/AuthPhone/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthPhoneConfirm'))).toBeNotVisible()

  //   /**
  //    * Tap to change region
  //   */
  //   await element(by.id('components/Formik/PhoneField/Flag')).tap()
  //   await element(by.type('UIPickerView')).setColumnToValue(0, 'Turkmenistan')
  //   await element(by.text('Confirm')).tap()
  //   /**
  //    * Phone reservation
  //    */
  //   const phone = `65809290`
  //   await element(by.id('components/AuthPhone/Form/phone')).clearText()
  //   await element(by.id('components/AuthPhone/Form/phone')).typeText(phone)
  //   await element(by.id('components/AuthPhone/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthPhoneConfirm'))).toBeVisible()

  // })

  // it('AuthEmail SignUp flow', async () => {
  //   await element(by.id('navigation/AuthNavigator/Signup/email')).tap()
  //   await expect(element(by.id('components/AuthEmail'))).toBeVisible()

  //   /**
  //    * Email length constraint validation 
  //    */
  //   await element(by.id('components/AuthEmail/Form/email')).clearText()
  //   await element(by.id('components/AuthEmail/Form/email')).typeText('aa')
  //   await element(by.id('components/AuthEmail/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthEmailConfirm'))).toBeNotVisible()

  //   /**
  //    * Email chars constraint validation 
  //    */
  //   await element(by.id('components/AuthEmail/Form/email')).clearText()
  //   await element(by.id('components/AuthEmail/Form/email')).typeText('asd-.')
  //   await element(by.id('components/AuthEmail/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthEmailConfirm'))).toBeNotVisible()

  //   /**
  //    * Email reservation
  //    */
  //   const inbox = await emailHelpers.createInbox()
  //   const email = inbox.emailAddress
  //   await element(by.id('components/AuthEmail/Form/email')).clearText()
  //   await element(by.id('components/AuthEmail/Form/email')).typeText(email)
  //   await element(by.id('components/AuthEmail/Form/submit')).tap()
  //   await expect(element(by.id('components/AuthEmailConfirm'))).toBeVisible()

  //   /**
  //    * Email confirmation
  //    */
  //   const lastEmail = await emailHelpers.getLatestEmail(inbox)
  //   const confirmationCode = await emailHelpers.extractConfirmationCode(lastEmail)
  //   await element(by.id('components/AuthEmailConfirm/Form/confirmationCode')).clearText()
  //   await element(by.id('components/AuthEmailConfirm/Form/confirmationCode')).typeText(confirmationCode)
  //   await expect(element(by.id('components/AuthPhoto'))).toBeVisible()
    
  //   /**
  //    * Take a photo for avatar
  //   */
  //   await element(by.id('components/AuthPhoto/Actions/photo')).tap()
  //   await expect(element(by.id('components/Camera/Shutter'))).toBeVisible()
  //   await element(by.id('components/Camera/Shutter/Snap')).tap()
  // })

  // it('Login Flow', async () => {
  //   /**
  //    * Login Flow by Email
  //   */
  //   await expect(element(by.id('components/AuthHome'))).toBeVisible()
  //   await element(by.id('templates/Auth/Action/Login')).tap()
  //   await expect(element(by.id('components/AuthSigninPhone'))).toBeVisible()
  //   await element(by.id('navigation/AuthNavigator/Signin/email')).tap()
  //   await expect(element(by.id('components/AuthSigninEmail'))).toBeVisible()

  //   await element(by.id('components/AuthSignin/Form/username')).tap()
  //   await element(by.id('components/AuthSignin/Form/username')).typeText('mayoldmail')
  //   await element(by.id('components/AuthSignin/Form/submit')).tap()
  //   await expect(element(by.id('components/PostsList'))).toBeNotVisible()

  //   await element(by.id('components/AuthSignin/Form/password')).tap()
  //   await element(by.id('components/AuthSignin/Form/password')).typeText('password')
  //   await element(by.id('components/AuthSignin/Form/submit')).tap()
  //   await expect(element(by.id('components/PostsList'))).toBeNotVisible()

  //   await element(by.id('components/AuthSignin/Form/username')).tap()
  //   await element(by.id('components/AuthSignin/Form/username')).typeText('@gmail.com')
  //   await element(by.id('components/AuthSignin/Form/submit')).tap()
  //   await expect(element(by.id('components/PostsList'))).toBeNotVisible()

  //   /**
  //    * Correct Enter
  //   */
  //   await element(by.id('components/AuthSignin/Form/username')).tap()
  //   await element(by.id('components/AuthSignin/Form/username')).clearText()
  //   await element(by.id('components/AuthSignin/Form/username')).typeText('qq@mailforspam.com')
  //   await element(by.id('components/AuthSignin/Form/password')).tap()
  //   await element(by.id('components/AuthSignin/Form/password')).clearText()
  //   await element(by.id('components/AuthSignin/Form/password')).typeText('!Testing1234!')
  //   await element(by.id('components/AuthSignin/Form/submit')).tap()
  //   await expect(element(by.id('components/PostsList'))).toBeNotVisible()
  // })

  it('Request Password reset Flow', async () => {
    /**
     * Wrong input shouldnt pass to next screen
    */
    // await expect(element(by.id('components/AuthHome'))).toBeVisible()
    // await element(by.id('components/AuthAction/Login')).tap()
    // await expect(element(by.id('components/AuthSigninPhone'))).toBeVisible()
    // await element(by.id('components/AuthActionPhone/ResetPassword')).tap()

    // await expect(element(by.id('components/AuthForgot'))).toBeVisible()
    // await element(by.id('components/AuthForgot/Form/username')).tap()
    // await element(by.id('components/AuthForgot/Form/username')).typeText('givemypassword')
    // await element(by.id('components/AuthForgot/Form/submit')).tap()
    // await expect(element(by.id('components/AuthForgotConfirm'))).toBeNotVisible()

    /**
     * Real
     * 
    */
    await expect(element(by.id('components/AuthHome'))).toBeVisible()
    await element(by.id('components/AuthAction/Login')).tap()
    await expect(element(by.id('components/AuthSigninPhone'))).toBeVisible()
    await element(by.id('components/AuthActionPhone/ResetPassword')).tap()

    await expect(element(by.id('components/AuthForgot'))).toBeVisible()
    await element(by.id('components/AuthForgot/Form/username')).tap()
    await element(by.id('components/AuthForgot/Form/username')).typeText('4bf15cac-916c-4a5b-8a01-4366d9624e41@mailslurp.com')
    await element(by.id('components/AuthForgot/Form/submit')).tap()
    await expect(element(by.id('components/AuthForgotConfirm'))).toBeVisible()

    const code = await emailHelpers.getPasswordResetCode('4bf15cac-916c-4a5b-8a01-4366d9624e41')
    await element(by.id('components/AuthForgotConfirm/Form/confirmationCode')).tap()
    await element(by.id('components/AuthForgotConfirm/Form/confirmationCode')).typeText(code)
    await element(by.id('components/AuthForgotConfirm/Form/password')).tap()
    await element(by.id('components/AuthForgotConfirm/Form/password')).typeText('password')
    await element(by.id('components/AuthForgotConfirm/Form/submit')).tap()

  })
}) 