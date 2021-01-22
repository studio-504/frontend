import * as UserService from 'services/User'

describe('UserService', () => {
  it('isUserOwner', () => {
    expect(UserService.isUserOwner(undefined)).toBeFalsy()
    expect(UserService.isUserOwner({})).toBeFalsy()
    expect(UserService.isUserOwner({ data: {} })).toBeFalsy()
    expect(UserService.isUserOwner({ data: { followedStatus: 'FOLLOW' } })).toBeFalsy()
    expect(UserService.isUserOwner({ data: { followedStatus: 'SELF' } })).toBeTruthy()
  })

  it('isUserActive', () => {
    expect(UserService.isUserActive()).toBeFalsy()
    expect(UserService.isUserActive(undefined)).toBeFalsy()
    expect(UserService.isUserActive({})).toBeFalsy()
    expect(UserService.isUserActive({ userStatus: undefined })).toBeFalsy()
    expect(UserService.isUserActive({ userStatus: 'ACTIVE' })).toBeTruthy()
  })
})
