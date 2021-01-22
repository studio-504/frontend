import * as UserService from 'services/User'

describe('UserService', () => {
  it('isUserOwner', () => {
    expect(UserService.isUserOwner(undefined)).toBeFalsy()
    expect(UserService.isUserOwner({})).toBeFalsy()
    expect(UserService.isUserOwner({ data: {} })).toBeFalsy()
    expect(UserService.isUserOwner({ data: { followedStatus: 'FOLLOW' } })).toBeFalsy()
    expect(UserService.isUserOwner({ data: { followedStatus: 'SELF' } })).toBeTruthy()
  })
})
