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
  describe('Scenario: upload avatar with camera', () => {
    it('Given app is ready', async () => {
      await initialize()
      await tap(Navigation.tabNavigator.profile)
      await toBeVisible(ProfileScreen.root)
    })

    it('Then navigate to settings screen', async () => {
      await tap(ProfileScreen.actions.settingsBtn)
      await toBeVisible(SettingsScreen.root)
    })

    it('Then open the camera', async () => {
      await tap(SettingsScreen.actions.changeAvatarBtn)
      await tapToText('Take a Photo')
      await tapToText('Confirm')
      await toBeVisible(CameraScreen.root)
    })

    it('Then take a photo and upload it', async () => {
      await tap(CameraScreen.actions.shutterBtn)
      await tapToText('Choose')
      await toBeVisible(ProfilePhotoUploadScreen.root)
    })

    it('Then expect the image to be uploaded', async () => {
      toBeVisible(ProfileScreen.root)
    })
  })

  describe('Scenario: upload avatar from library', () => {
    it('Given: app is ready', async () => {
      await initialize()
      await tap(Navigation.tabNavigator.profile)
      await toBeVisible(ProfileScreen.root)
    })

    it('Then navigate to settings screen', async () => {
      await tap(ProfileScreen.actions.settingsBtn)
      await toBeVisible(SettingsScreen.root)
    })

    it('Then pick an image from gallery and start uploading', async () => {
      await tap(SettingsScreen.actions.changeAvatarBtn)
      await tapToText('Choose From Gallery')
      await tapToText('Confirm')
      await toBeVisible(ProfilePhotoUploadScreen.root)
    })

    it('Then expect the image to be uploaded', async () => {
      toBeVisible(ProfileScreen.root)
    })
  })
})
