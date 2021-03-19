/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "testBlackListAction", "expectSaga", "testShowMessage"] }] */
import { expectSaga } from 'redux-saga-test-plan'
import { testAsRootSaga } from 'tests/utils/helpers'
import { showMessage } from 'react-native-flash-message'
import snackbars from 'store/ducks/snackbars/saga'
import * as Logger from 'services/Logger'
import * as usersActions from 'store/ducks/users/actions'

jest.mock('react-native-flash-message', () => ({ showMessage: jest.fn() }))

const successAction = usersActions.usersEditProfileSuccess({}, { messageCode: 'FORM_EDIT_PROFILE' })

describe('Capture Success', () => {
  afterEach(() => {
    showMessage.mockClear()
    Logger.captureException.mockClear()
  })

  function testShowMessage(message) {
    expect(showMessage).toHaveBeenCalled()
    const options = showMessage.mock.calls[0][0]

    expect(options.message).toBe(message)
    expect(options.type).toBe('success')
    expect(options.icon).toBe('success')
  }

  describe('success', () => {
    it('usersEditProfileSuccess', async () => {
      await expectSaga(testAsRootSaga(snackbars)).dispatch(successAction).silentRun()

      testShowMessage('Profile has updated')
    })

    it('usersEditProfileSuccess generic', async () => {
      await expectSaga(testAsRootSaga(snackbars)).dispatch(usersActions.usersEditProfileSuccess()).silentRun()

      expect(showMessage).not.toHaveBeenCalled()
    })
  })

  describe('failure', () => {
    it('capture exception', async () => {
      const error = new Error('Error')
      showMessage.mockRejectedValueOnce(error)

      await expectSaga(testAsRootSaga(snackbars)).dispatch(successAction).silentRun()

      expect(Logger.captureException).toHaveBeenCalledWith(error)
    })
  })
})
