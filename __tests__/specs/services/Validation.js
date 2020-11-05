import * as Validation from 'services/Validation'
import { repeat, join, times } from 'ramda'
import API from '@aws-amplify/api'
import * as usersQueries from 'store/ducks/users/queries'

jest.mock('@aws-amplify/api', () => ({
  graphql: jest.fn().mockResolvedValue({ data: { usernameStatus: 'AVAILABLE' } }),
  graphqlOperation: jest.fn().mockResolvedValue(true),
}))

describe('Validation service', () => {
  afterEach(() => {
    API.graphql.mockClear()
    API.graphqlOperation.mockClear()
  })

  it('getPhone', () => {
    expect(Validation.getPhone({})).toBe('')
    expect(Validation.getPhone({ phone: ' 1232WDEWE4234 ' })).toBe('12324234')
  })

  it('getCountryCode', () => {
    expect(Validation.getCountryCode({})).toBe('+1')
    expect(Validation.getCountryCode({ countryCode: ' Wcsw2 ' })).toBe('2')
  })

  it('getEmail', () => {
    expect(Validation.getEmail({})).toBe('')
    expect(Validation.getEmail({ email: ' VAlid@mail.com ' })).toBe('valid@mail.com')
  })

  it('email', async () => {
    expect(await Validation.email.isValid(undefined)).toBeFalsy()
    expect(await Validation.email.isValid('')).toBeFalsy()
    expect(await Validation.email.isValid('1')).toBeFalsy()
    expect(await Validation.email.isValid('12')).toBeFalsy()
    expect(await Validation.email.isValid('valid@mail.com')).toBeTruthy()
    expect(await Validation.email.cast(' trim ')).toBe('trim')
    expect(await Validation.email.isValid('with white space@mail.com')).toBeFalsy()
  })

  it('phone', async () => {
    expect(await Validation.phone.isValid(undefined)).toBeFalsy()
    expect(await Validation.phone.isValid('')).toBeFalsy()
    expect(await Validation.phone.isValid('1')).toBeFalsy()
    expect(await Validation.phone.isValid('12')).toBeFalsy()
    expect(await Validation.phone.isValid('123sfsdfds')).toBeFalsy()
    expect(await Validation.phone.isValid('123')).toBeTruthy()
    expect(await Validation.phone.isValid(join('', repeat('1', 50)))).toBeTruthy()
    expect(await Validation.phone.isValid(join('', repeat('1', 51)))).toBeFalsy()
    expect(await Validation.phone.isValid('123456789')).toBeTruthy()
    expect(await Validation.phone.cast(' trim ')).toBe('trim')
  })

  it('username', async () => {
    expect(await Validation.username.isValid(undefined)).toBeFalsy()
    expect(await Validation.username.isValid('')).toBeFalsy()
    expect(await Validation.username.isValid('1')).toBeFalsy()
    expect(await Validation.username.isValid('12')).toBeFalsy()
    expect(await Validation.username.isValid('123')).toBeTruthy()
    expect(await Validation.username.isValid(join('', repeat('a', 50)))).toBeTruthy()
    expect(await Validation.username.isValid(join('', repeat('a', 51)))).toBeFalsy()
    expect(await Validation.username.isValid('abc123')).toBeTruthy()
    expect(await Validation.username.isValid('abc123!@#$%')).toBeFalsy()
    expect(await Validation.username.cast(' trim ')).toBe('trim')
  })

  it('usernameStatusRequest', async () => {
    const username = 'username'
    await Validation.usernameStatusRequest(username)
    expect(API.graphql).toHaveBeenCalled()
    expect(API.graphqlOperation).toHaveBeenCalledWith(usersQueries.usernameStatus, { username })
  })

  describe('remoteUsernameValidation', () => {
    it('success', async () => {
      API.graphql.mockResolvedValue({ data: { usernameStatus: 'AVAILABLE' } })

      const value = 'value'
      const validate = Validation.remoteUsernameValidation()
      const results = await Promise.all(times(() => validate(value), 10))

      expect(results).toEqual([
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      ])
      expect(API.graphql).toHaveBeenCalledTimes(2)
    })

    it('not available', async () => {
      API.graphql.mockResolvedValue({ data: { usernameStatus: 'NOT_AVAILABLE' } })

      const value = 'value'
      const validate = Validation.remoteUsernameValidation()
      const results = await Promise.all(times(() => validate(value), 10))

      expect(results).toEqual([
        false,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      ])
      expect(API.graphql).toHaveBeenCalledTimes(2)
    })

    it('not reject an error on failure request', async () => {
      API.graphql.mockRejectedValue(false)

      const value = 'value'
      const validate = Validation.remoteUsernameValidation()
      const results = await Promise.all(times(() => validate(value), 10))

      expect(results).toEqual([
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      ])
      expect(API.graphql).toHaveBeenCalledTimes(2)
    })
  })
})
