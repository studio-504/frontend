import { Linking } from 'react-native'
import { getContext } from 'redux-saga/effects'
import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import contacts from 'store/ducks/contacts/saga'
import * as authSelectors from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'
import * as actions from 'store/ducks/contacts/actions'
import * as queries from 'store/ducks/contacts/queries'
import * as queryService from 'services/Query'

jest.spyOn(Linking, 'openURL')
Linking.openURL.mockResolvedValue(true)

jest.mock('react-native-contacts', () => ({ getAll: jest.fn() }))

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))
jest.mock('store/ducks/auth/selectors', () => ({ authUserSelector: jest.fn() }))

authSelectors.authUserSelector.mockReturnValue({ username: 'username' })

const user = { contactId: 1 }
const tenInvited = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
  10: true,
}

const navigation = { navigate: jest.fn() }

const setupSaga = () =>
  expectSaga(testAsRootSaga(contacts)).provide([[getContext('ReactNavigationRef'), { current: navigation }]])

describe('Contacts Grand bonus saga', () => {
  afterEach(() => {
    navigation.navigate.mockClear()
  })

  describe('success', () => {
    it('grand bonus on contactsInviteSuccess', async () => {
      await setupSaga()
        .withState({ contacts: { contactsInvite: { invited: tenInvited } } })

        .call(queryService.apiRequest, queries.grantUserSubscriptionBonus)
        .put(usersActions.usersGetProfileSelfRequest())

        .dispatch(actions.contactsInviteSuccess(user))
        .silentRun()

      testNavigate(navigation, 'InviteFriendsSuccess')
    })

    it('grand bonus on contactsFollowSuccess', async () => {
      await setupSaga()
        .withState({ contacts: { contactsInvite: { invited: tenInvited } } })

        .call(queryService.apiRequest, queries.grantUserSubscriptionBonus)
        .put(usersActions.usersGetProfileSelfRequest())

        .dispatch(actions.contactsFollowSuccess(user))
        .silentRun()

      testNavigate(navigation, 'InviteFriendsSuccess')
    })
  })

  describe('failure', () => {
    it('request error', async () => {
      queryService.apiRequest.mockRejectedValueOnce(false)

      await setupSaga()
        .withState({ contacts: { contactsInvite: { invited: tenInvited } } })

        .call(queryService.apiRequest, queries.grantUserSubscriptionBonus)
        .not.put(usersActions.usersGetProfileSelfRequest())

        .dispatch(actions.contactsInviteSuccess(user))
        .silentRun()

      expect(navigation.navigate).not.toHaveBeenCalled()
    })

    it('not enough invited', async () => {
      await setupSaga()
        .withState({ contacts: { contactsInvite: { invited: { 1: true } } } })

        .not.call(queryService.apiRequest, queries.grantUserSubscriptionBonus)
        .not.put(usersActions.usersGetProfileSelfRequest())

        .dispatch(actions.contactsInviteSuccess(user))
        .silentRun()

      expect(navigation.navigate).not.toHaveBeenCalled()
    })
  })
})
