import * as emailHelpers from './helpers/email'

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({permissions: {camera: 'YES', medialibrary: 'YES', photos: 'YES'}})
  })


  it('Request Password reset Flow', async () => {

    const mailslurpMail = 'aebbb3ce-e99c-498b-bc69-eb715f0f5fd9@mailslurp.com'
    const inboxId = mailslurpMail.split('@')[0]
    const newPassword = '!Testing1234!'


    /**
     * Wrong input shouldnt pass to next screen
    */
    await expect(element(by.id('components/AuthHome'))).toBeVisible()
    await element(by.id('components/AuthAction/Login')).tap()
    await expect(element(by.id('components/AuthSigninPhone'))).toBeVisible()
    await element(by.id('components/AuthActionPhone/ResetPassword')).tap()

    await expect(element(by.id('components/AuthForgotPhone'))).toBeVisible()
    await element(by.id('navigation/AuthNavigator/Forgot/email')).tap()
    await element(by.id('components/AuthForgot/Form/username')).tap()
    await element(by.id('components/AuthForgot/Form/username')).typeText('givemypassword')
    await element(by.id('components/AuthForgotEmail/Form/submit')).tap()
    await expect(element(by.id('components/AuthForgotConfirm'))).toBeNotVisible()
    
    
    //Email input validations not working

    /**
     * Valid inputs
    */
    
    await element(by.id('components/AuthForgot/Form/username')).clearText()
    // await expect(element(by.id('components/AuthHome'))).toBeVisible()
    // await element(by.id('components/AuthAction/Login')).tap()
    // await expect(element(by.id('components/AuthSigninPhone'))).toBeVisible()
    // await element(by.id('components/AuthActionPhone/ResetPassword')).tap()
    // await expect(element(by.id('components/AuthForgotPhone'))).toBeVisible()
    // await element(by.id('navigation/AuthNavigator/Forgot/email')).tap()
    // await element(by.id('components/AuthForgot/Form/username')).tap()
    await element(by.id('components/AuthForgot/Form/username')).typeText(mailslurpMail)
    await element(by.id('components/AuthForgotEmail/Form/submit')).tap()
    await expect(element(by.id('components/AuthForgotConfirm'))).toBeVisible()

    const code = await emailHelpers.getPasswordResetCode(inboxId)
    await element(by.id('components/AuthForgotConfirm/Form/confirmationCode')).tap()

    /**
     * Write wrong code
    */
    await element(by.id('components/AuthForgotConfirm/Form/confirmationCode')).typeText('123456')
    await element(by.id('components/AuthForgotConfirm/Form/password')).tap()
    await element(by.id('components/AuthForgotConfirm/Form/password')).typeText('differrent type')
    await element(by.id('components/AuthForgotConfirm/Form/submit')).tap()
    await expect(element(by.id('components/AuthSigninPhone'))).toBeNotVisible()

    /**
     * Write wrong password
    */
    await element(by.id('templates/Auth/Error/Close')).tap()
    await element(by.id('components/AuthForgotConfirm/Form/confirmationCode')).tap()
    await element(by.id('components/AuthForgotConfirm/Form/confirmationCode')).clearText()
    
    await element(by.id('components/AuthForgotConfirm/Form/confirmationCode')).typeText(code)
    await element(by.id('components/AuthForgotConfirm/Form/password')).tap()
    await element(by.id('components/AuthForgotConfirm/Form/password')).typeText('123')
    await element(by.id('components/AuthForgotConfirm/Form/submit')).tap()
    await expect(element(by.id('components/AuthSigninPhone'))).toBeNotVisible()
    
    /**
     * Write valid password 
    */
    // await element(by.id('templates/Auth/Error/Close')).tap()
    await element(by.id('components/AuthForgotConfirm/Form/password')).clearText()
    await element(by.id('components/AuthForgotConfirm/Form/password')).typeText(newPassword)
    await element(by.id('components/AuthForgotConfirm/Form/submit')).tap()
    await expect(element(by.id('components/AuthSigninPhone'))).toBeVisible()

    /**
     * Login with new password
    */
    await element(by.id('navigation/AuthNavigator/Signin/email')).tap()
    await expect(element(by.id('components/AuthSigninEmail'))).toBeVisible()
    await element(by.id('components/AuthSignin/Form/username')).tap()
    await element(by.id('components/AuthSignin/Form/username')).typeText(mailslurpMail)
    await element(by.id('components/AuthSignin/Form/password')).tap()
    await element(by.id('components/AuthSignin/Form/password')).clearText()
    await element(by.id('components/AuthSignin/Form/password')).typeText(newPassword)
    await element(by.id('components/AuthSignin/Form/submit')).tap()
    await expect(element(by.id('components/PostsList'))).toBeVisible()
  })

})