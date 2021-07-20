import * as actions from '../../helpers/actions/authActions'
import { credentials, permissions } from '../../helpers/users'
import { toBeVisible, waitForElement, tap, tapToText } from '../../helpers/utils'
import {
  Navigation,
  FeedScreen,
  ProfileScreen,
  SettingsScreen,
  CameraScreen,
  ProfilePhotoUploadScreen,
} from './../../helpers/screens'

async function initialize() {
  await device.launchApp({ permissions, delete: true, newInstance: true })
  await actions.signIn(credentials)
  await waitForElement(FeedScreen.root)
}

describe('Feature: Upload avatar', () => {
  describe('Upload avatar with camera', () => {
    it('should navigate to profile screen', async () => {
      await initialize()
      await tap(Navigation.tabNavigator.profile)
      await toBeVisible(ProfileScreen.root)
    })

    it('should navigate to settings screen', async () => {
      await tap(ProfileScreen.actions.settingsBtn)
      await toBeVisible(SettingsScreen.root)
    })

    it('should open camera screen', async () => {
      await tap(SettingsScreen.actions.changeAvatarBtn)
      await tapToText('Take a Photo')
      await tapToText('Confirm')
      await toBeVisible(CameraScreen.root)
    })

    it('should take a photo and upload', async () => {
      await tap(CameraScreen.actions.shutterBtn)
      await tapToText('Choose')
      await toBeVisible(ProfilePhotoUploadScreen.root)
    })

    it('should navigate to profile screen after uploading', async () => {
      toBeVisible(ProfileScreen.root)
    })
  })

  describe('Upload avatar from library', () => {
    it('should navigate to profile screen', async () => {
      await initialize()
      await tap(Navigation.tabNavigator.profile)
      await toBeVisible(ProfileScreen.root)
    })

    it('should navigate to settings screen', async () => {
      await tap(ProfileScreen.actions.settingsBtn)
      await toBeVisible(SettingsScreen.root)
    })

    it('should pick an image from gallery', async () => {
      await tap(SettingsScreen.actions.changeAvatarBtn)
      await tapToText('Choose From Gallery')
      await tapToText('Confirm')
      await toBeVisible(ProfilePhotoUploadScreen.root)
    })

    it('should navigate to profile screen after uploading', async () => {
      toBeVisible(ProfileScreen.root)
    })
  })
})
