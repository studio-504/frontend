describe('Example', () => {
  

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should navigate to LogIn screen', async () => {
    await element(by.id('login_1')).tap();
    expect(element(by.id('authSignIn_2'))).toBeVisible();
  });
  
  // it('should have welcome screen', async () => {
  //   await expect(element(by.id('welcome'))).toBeVisible();
  // });

  // it('should show hello screen after tap', async () => {
  //   await element(by.id('hello_button')).tap();
  //   await expect(element(by.text('Hello!!!'))).toBeVisible();
  // });

  // it('should show world screen after tap', async () => {
  //   await element(by.id('world_button')).tap();
  //   await expect(element(by.text('World!!!'))).toBeVisible();
  // });
});
