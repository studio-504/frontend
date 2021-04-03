import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { getContext } from 'redux-saga/effects'
import * as actions from 'store/ducks/signup/actions'
import { testAsRootSaga, testNavigate } from 'tests/utils/helpers'
import signupCreate, { COGNITO_PROVIDER } from 'store/ducks/signup/saga/signupCreate'
import { logEvent } from 'services/Analytics'
import * as queryService from 'services/Query'
import * as queries from 'store/ducks/signup/queries'
import * as helpers from 'store/ducks/signup/saga/helpers'

jest.spyOn(helpers, 'generateExpirationDate').mockReturnValue('expirationDate')

jest.mock('react-native-config', () => ({
  AWS_COGNITO_REGION: 'AWS_COGNITO_REGION',
  AWS_COGNITO_USER_POOL_ID: 'AWS_COGNITO_USER_POOL_ID',
}))

jest.mock('services/Query', () => ({ apiRequest: jest.fn().mockResolvedValue(true) }))
const navigation = { navigate: jest.fn() }
const email = 'valid@mail.com'

const AwsAuth = { federatedSignIn: jest.fn() }

describe('signupCreate', () => {
  afterEach(() => {
    navigation.navigate.mockClear()
    queryService.apiRequest.mockClear()
    logEvent.mockClear()
    AwsAuth.federatedSignIn.mockClear()
  })

  it('COGNITO_PROVIDER', () => {
    expect(COGNITO_PROVIDER).toBe('cognito-idp.AWS_COGNITO_REGION.amazonaws.com/AWS_COGNITO_USER_POOL_ID')
  })

  describe('success', () => {
    const tokens = { IdToken: 'IdToken' }

    it('email', async () => {
      const usernameType = 'email'

      await expectSaga(testAsRootSaga(signupCreate))
        .provide([
          [getContext('AwsAuth'), AwsAuth],
          [getContext('ReactNavigationRef'), { current: navigation }],
          [matchers.call.fn(queryService.apiRequest), Promise.resolve({ data: { createAnonymousUser: tokens } })],
          [matchers.call.fn(queryService.apiRequest), Promise.resolve(true)],
        ])

        .call([queryService, 'apiRequest'], queries.createAnonymousUser)
        .call([AwsAuth, 'federatedSignIn'], COGNITO_PROVIDER, { token: 'IdToken', expires_at: 'expirationDate' }, {})
        .call([queryService, 'apiRequest'], queries.startChangeUserEmail, { email })
        .call(logEvent, 'SIGNUP_EMAIL_SUCCESS')
        .put(actions.signupCreateSuccess())

        .dispatch(actions.signupCreateRequest({ usernameType, email }))
        .silentRun()

      testNavigate(navigation, 'Auth.AuthEmailConfirm')
    })

    it('phone', async () => {
      const countryCode = '+1'
      const phone = '1234567'
      const phoneNumber = `${countryCode}${phone}`
      const usernameType = 'phone'

      await expectSaga(testAsRootSaga(signupCreate))
        .provide([
          [getContext('AwsAuth'), AwsAuth],
          [getContext('ReactNavigationRef'), { current: navigation }],
          [matchers.call.fn(queryService.apiRequest), Promise.resolve({ data: { createAnonymousUser: tokens } })],
          [matchers.call.fn(queryService.apiRequest), Promise.resolve(true)],
        ])

        .call([queryService, 'apiRequest'], queries.createAnonymousUser)
        .call([AwsAuth, 'federatedSignIn'], COGNITO_PROVIDER, { token: 'IdToken', expires_at: 'expirationDate' }, {})
        .call([queryService, 'apiRequest'], queries.startChangeUserPhoneNumber, { phoneNumber })
        .call(logEvent, 'SIGNUP_PHONE_SUCCESS')
        .put(actions.signupCreateSuccess())

        .dispatch(actions.signupCreateRequest({ usernameType, countryCode, phone }))
        .silentRun()

      testNavigate(navigation, 'Auth.AuthPhoneConfirm')
    })
  })

  describe('failure', () => {
    it('USER_CONFIRMATION_DELIVERY', async () => {
      const nativeError = new Error('USER_CONFIRMATION_DELIVERY')
      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await expectSaga(testAsRootSaga(signupCreate))
        .not.put.like(actions.signupCreateSuccess())
        .put(actions.signupCreateFailure(nativeError, { messageCode: 'USER_CONFIRMATION_DELIVERY' }))

        .dispatch(actions.signupCreateRequest({ usernameType: 'email', email }))

        .silentRun()
    })

    it('UsernameExistsException', async () => {
      const nativeError = new Error('UsernameExistsException')
      nativeError.code = 'UsernameExistsException'
      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await expectSaga(testAsRootSaga(signupCreate))
        .not.put.like(actions.signupCreateSuccess())
        .put(actions.signupCreateFailure(nativeError, { messageCode: 'USER_EXISTS' }))

        .dispatch(actions.signupCreateRequest({ usernameType: 'email', email }))

        .silentRun()
    })

    it('InvalidPasswordException', async () => {
      const nativeError = new Error('InvalidPasswordException')
      nativeError.code = 'InvalidPasswordException'
      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await expectSaga(testAsRootSaga(signupCreate))
        .not.put.like(actions.signupCreateSuccess())
        .put(actions.signupCreateFailure(nativeError, { messageCode: 'INVALID_PASSWORD' }))

        .dispatch(actions.signupCreateRequest({ usernameType: 'email', email }))

        .silentRun()
    })

    it('InvalidParameterException', async () => {
      const nativeError = new Error('InvalidParameterException')
      nativeError.code = 'InvalidParameterException'
      queryService.apiRequest.mockRejectedValueOnce(nativeError)

      await expectSaga(testAsRootSaga(signupCreate))
        .not.put.like(actions.signupCreateSuccess())
        .put(actions.signupCreateFailure(nativeError, { messageCode: 'INVALID_PARAMETER' }))

        .dispatch(actions.signupCreateRequest({ usernameType: 'email', email }))

        .silentRun()
    })
  })
})
