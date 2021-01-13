/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "testGqlError", "expectSaga"] }] */
import { expectSaga } from 'redux-saga-test-plan'
import { getContext } from 'redux-saga/effects'
import usersSetUserDatingStatusRequest from 'store/ducks/users/saga/usersSetUserDatingStatus'
import * as usersActions from 'store/ducks/users/actions'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/users/queries'
import { errorWrapper } from 'store/helpers'
import { testEntitiesMerge } from 'tests/utils/helpers'

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))

const payload = { userId: 1 }
const action = usersActions.usersSetUserDatingStatusRequest(payload)

describe('usersSetUserDatingStatusRequest', () => {
  afterEach(() => {
    queryService.apiRequest.mockClear()
  })

  it('success', async () => {
    const user = { userId: 1 }
    const response = { data: { setUserDatingStatus: user } }
    const entities = { users: { 1: user } }

    queryService.apiRequest.mockResolvedValueOnce(response)

    const saga = expectSaga(usersSetUserDatingStatusRequest, action)

    await testEntitiesMerge(saga, entities)
      .provide([[getContext('errorWrapper'), errorWrapper]])

      .put(usersActions.usersSetUserDatingStatusSuccess({ data: 1, payload }))

      .silentRun()

    expect(queryService.apiRequest).toHaveBeenCalledWith(queries.setUserDatingStatus, payload)
  })

  describe('show specific error message', () => {
    const testGqlError = async ({ code, text }) => {
      const message = {
        code,
        text,
        nativeError: '',
      }

      const gqlError = { errors: [{ errorInfo: [{ a: 1 }, 'sdfsd', code, 'dsf'] }] }

      queryService.apiRequest.mockRejectedValueOnce(gqlError)

      await expectSaga(usersSetUserDatingStatusRequest, action)
        .provide([[getContext('errorWrapper'), errorWrapper]])
        .put(usersActions.usersSetUserDatingStatusFailure({ message, payload }))
        .run()
    }

    it('native error', async () => {
      const error = new Error('Error')
      const message = {
        code: 'GENERIC',
        text: 'Unable to enable dating',
        nativeError: '',
      }

      queryService.apiRequest.mockRejectedValueOnce(error)

      await expectSaga(usersSetUserDatingStatusRequest, action)
        .provide([[getContext('errorWrapper'), errorWrapper]])
        .put(usersActions.usersSetUserDatingStatusFailure({ message, payload }))
        .run()
    })

    it('GENERIC by default', async () => {
      const message = {
        code: 'GENERIC',
        text: 'Unable to enable dating',
        nativeError: '',
      }

      const gqlError = { errors: [{ errorInfo: [] }] }

      queryService.apiRequest.mockRejectedValueOnce(gqlError)

      await expectSaga(usersSetUserDatingStatusRequest, action)
        .provide([[getContext('errorWrapper'), errorWrapper]])
        .put(usersActions.usersSetUserDatingStatusFailure({ message, payload }))
        .run()
    })

    it('MISSING_DISPLAY_NAME', async () => {
      await testGqlError({ code: 'MISSING_DISPLAY_NAME', text: 'Display name is missing' })
    })

    it('MISSING_PHOTO_POST_ID', async () => {
      await testGqlError({ code: 'MISSING_PHOTO_POST_ID', text: 'Please upload a profile photo' })
    })

    it('MISSING_AGE', async () => {
      await testGqlError({ code: 'MISSING_AGE', text: 'Age is missing' })
    })

    it('MISSING_GENDER', async () => {
      await testGqlError({ code: 'MISSING_GENDER', text: 'Gender is missing' })
    })

    it('MISSING_LOCATION', async () => {
      await testGqlError({ code: 'MISSING_LOCATION', text: 'Location is missing' })
    })

    it('MISSING_HEIGHT', async () => {
      await testGqlError({ code: 'MISSING_HEIGHT', text: 'Height is missing' })
    })

    it('MISSING_MATCH_AGE_RANGE', async () => {
      await testGqlError({ code: 'MISSING_MATCH_AGE_RANGE', text: 'Match age is missing' })
    })

    it('MISSING_MATCH_GENDERS', async () => {
      await testGqlError({ code: 'MISSING_MATCH_GENDERS', text: 'Match gender is missing' })
    })

    it('MISSING_MATCH_HEIGHT_RANGE', async () => {
      await testGqlError({ code: 'MISSING_MATCH_HEIGHT_RANGE', text: 'Match height is missing' })
    })

    it('MISSING_MATCH_LOCATION_RADIUS', async () => {
      await testGqlError({ code: 'MISSING_MATCH_LOCATION_RADIUS', text: 'Match location radius is missing' })
    })

    it('WRONG_AGE_MIN', async () => {
      await testGqlError({ code: 'WRONG_AGE_MIN', text: 'Invalid min age' })
    })

    it('WRONG_AGE_MAX', async () => {
      await testGqlError({ code: 'WRONG_AGE_MAX', text: 'Invalid max age' })
    })

    it('WRONG_THREE_HOUR_PERIOD', async () => {
      await testGqlError({ code: 'WRONG_THREE_HOUR_PERIOD', text: 'You can only enable dating once per day' })
    })
  })
})
