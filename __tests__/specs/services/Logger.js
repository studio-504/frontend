import * as Sentry from '@sentry/react-native'

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
      const error = 'Native Error'
      Logger.captureMessage(error)

      expect(Sentry.captureMessage).toHaveBeenCalledWith(error)
    })
  })

  describe('captureException', () => {
    it('success', () => {
      const error = new Error('Native Error')
      Logger.captureException(error)

      expect(Sentry.captureException).toHaveBeenCalledWith(error)
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
