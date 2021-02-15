import * as Sentry from '@sentry/react-native'
import * as ErrorsService from 'services/Errors'

const { CancelRequestOnSignoutError } = ErrorsService

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureMessage: jest.fn(),
  captureException: jest.fn(),
  setUser: jest.fn(),
  withScope: jest.fn(),
}))
jest.mock('react-native-code-push', () => ({ getUpdateMetadata: jest.fn().mockResolvedValue(false) }))
const Logger = jest.requireActual('services/Logger')

describe('Logger', () => {
  afterEach(() => {
    Sentry.captureMessage.mockClear()
    Sentry.captureException.mockClear()
    Sentry.setUser.mockClear()
    Sentry.withScope.mockClear()
  })

  describe('captureMessage', () => {
    it('success', () => {
      const error = new Error('Native Error')
      Logger.captureMessage(error)

      expect(Sentry.captureMessage).toHaveBeenCalledWith(error)
    })

    it('failure when error instanceof CancelRequestOnSignoutError', () => {
      const error = new CancelRequestOnSignoutError('CancelRequestOnSignoutError')
      Logger.captureMessage(error)

      expect(Sentry.captureMessage).not.toHaveBeenCalled()
    })
  })

  describe('captureException', () => {
    it('success', () => {
      const error = new Error('Native Error')
      Logger.captureException(error)

      expect(Sentry.captureException).toHaveBeenCalledWith(error)
    })

    it('failure when error instanceof CancelRequestOnSignoutError', () => {
      const error = new CancelRequestOnSignoutError('CancelRequestOnSignoutError')
      Logger.captureException(error)

      expect(Sentry.captureException).not.toHaveBeenCalled()
    })
  })

  describe('setUser', () => {
    it('set only id, username, email attributes', () => {
      const user = { a: 1, b: 2, id: 3, username: 4, email: 'valid@email.com' }
      Logger.setUser(user)

      expect(Sentry.setUser).toHaveBeenCalledWith({ id: 3, username: 4, email: 'valid@email.com' })
    })
  })

  describe('withScope', () => {
    it('call Sentry withScope', () => {
      Logger.withScope()

      expect(Sentry.withScope).toHaveBeenCalled()
    })
  })
})
