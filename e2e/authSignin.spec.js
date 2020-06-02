import * as emailHelpers from './helpers/email'

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({permissions: {camera: 'YES', medialibrary: 'YES', photos: 'YES'}})
  })

  /**
   * 
  */
  it('Signin Flow', async () => {
    /**
     * Signin using Email
    */
    await expect(element(by.id('components/AuthHome'))).toBeVisible()
    await element(by.id('components/AuthAction/Login')).tap()
    await expect(element(by.id('components/AuthSigninPhone'))).toBeVisible()
    await element(by.id('navigation/AuthNavigator/Signin/email')).tap()
    await expect(element(by.id('components/AuthSigninEmail'))).toBeVisible()
    

    await element(by.id('components/AuthSignin/Form/username')).tap()
    await element(by.id('components/AuthSignin/Form/username')).typeText('mayoldmail')
    await element(by.id('components/AuthSignin/Form/submit')).tap()
    await expect(element(by.id('components/PostsList'))).toBeNotVisible()

    await element(by.id('components/AuthSignin/Form/password')).tap()
    await element(by.id('components/AuthSignin/Form/password')).typeText('password')
    await element(by.id('components/AuthSignin/Form/submit')).tap()
    await expect(element(by.id('components/PostsList'))).toBeNotVisible()

    await element(by.id('components/AuthSignin/Form/username')).tap()
    await element(by.id('components/AuthSignin/Form/username')).typeText('@gmail.com')
    await element(by.id('components/AuthSignin/Form/submit')).tap()
    await expect(element(by.id('components/PostsList'))).toBeNotVisible()

    /**
     * Correct Enter
    */
    await element(by.id('components/AuthSignin/Form/username')).tap()
    await element(by.id('components/AuthSignin/Form/username')).clearText()
    await element(by.id('components/AuthSignin/Form/username')).typeText('qq@mailforspam.com')
    await element(by.id('components/AuthSignin/Form/password')).tap()
    await element(by.id('components/AuthSignin/Form/password')).clearText()
    await element(by.id('components/AuthSignin/Form/password')).typeText('!Testing1234!')
    await element(by.id('components/AuthSignin/Form/submit')).tap()
    await expect(element(by.id('components/PostsList'))).toBeVisible()
  })
})
