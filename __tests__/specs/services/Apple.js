import { getFullname } from 'services/Apple'

jest.mock('@invertase/react-native-apple-authentication', () => ({ appleAuth: {} }))

describe('Apple Service', () => {
  it('getFullname', () => {
    const familyName = 'familyName'
    const givenName = 'givenName'

    expect(getFullname()).toBe('')
    expect(getFullname({})).toBe('')
    expect(getFullname({ fullName: {} })).toBe('')
    expect(getFullname({ fullName: { familyName } })).toBe(familyName)
    expect(getFullname({ fullName: { givenName } })).toBe(givenName)
    expect(getFullname({ fullName: { familyName, givenName } })).toBe(`${givenName} ${familyName}`)
  })
})
