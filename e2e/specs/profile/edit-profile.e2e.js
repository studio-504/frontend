import { describe } from 'jest-circus'
import * as actions from '../../helpers/actions/authActions'
import { credentials, permissions } from '../../helpers/users'
import { toBeVisible, waitForElement, tap, generateUsername, toHaveValue, sleep } from '../../helpers/utils'
import {
  Navigation,
  FeedScreen,
  ProfileScreen,
  SettingsScreen,
  ProfileEditScreen,
} from './../../helpers/screens'

async function getFields() {
  return {
    username: element(by.id(ProfileEditScreen.form.username)),
    fullname: element(by.id(ProfileEditScreen.form.fullname)),
    bio: element(by.id(ProfileEditScreen.form.bio)),
  }
}

async function fillField(name, value) {
  const fields = await getFields()
  const field = fields[name]

  await field.clearText()
  await field.typeText(value)
}

const newUsername = generateUsername()
const newFullname = generateUsername()
const newBio = generateUsername()

describe('Feature: edit profile', () => {
  beforeAll(async () => {
    await device.launchApp({ permissions, newInstance: true })
    await actions.signIn(credentials)
    await waitForElement(FeedScreen.root)
  })

  describe('Scenario: navigate to profile edit screen', () => {
    it('Given feed screen', async () => {
      await toBeVisible(FeedScreen.root)
    })

    it('Then navigate to profile screen', async () => {
      await tap(Navigation.tabNavigator.profile)
      await toBeVisible(ProfileScreen.root)
    })

    it('Then navigate to settings screen', async () => {
      await tap(ProfileScreen.actions.settingsBtn)
      await toBeVisible(SettingsScreen.root)
    })

    it('Then navigate to edit profile screen', async () => {
      await tap(SettingsScreen.actions.editProfileBtn)
      await toBeVisible(ProfileEditScreen.root)
    })
  })

  describe('Scenario: edit profile', () => {
    it('Fill inputs and submit', async () => {
      await fillField('username', newUsername)
      await fillField('fullname', newFullname)
      await fillField('bio', newBio)
      await tap(ProfileEditScreen.form.submitBtn)
      await tap(ProfileEditScreen.form.submitBtn)
    })

    it('Then back and forth', async () => {
      await sleep(4000)
      await tap(ProfileEditScreen.actions.headerBack)
      await tap(SettingsScreen.actions.editProfileBtn)
    })

    it('Then check if saved', async () => {
      await toBeVisible(ProfileEditScreen.root)
      await toHaveValue(ProfileEditScreen.form.username, newUsername)
      await toHaveValue(ProfileEditScreen.form.fullname, newFullname)
      await toHaveValue(ProfileEditScreen.form.bio, newBio)
    })
  })
})
