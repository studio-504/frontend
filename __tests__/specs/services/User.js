import * as UserService from 'services/User'

describe('UserService', () => {
  it('isUserActive', () => {
    expect(UserService.isUserActive()).toBeFalsy()
    expect(UserService.isUserActive(undefined)).toBeFalsy()
    expect(UserService.isUserActive({})).toBeFalsy()
    expect(UserService.isUserActive({ userStatus: undefined })).toBeFalsy()
    expect(UserService.isUserActive({ userStatus: 'ACTIVE' })).toBeTruthy()
  })
})
