import React from 'react'
import ProfileSelfScreen from 'screens/ProfileSelfScreen'
import { renderWithStore } from 'tests/utils'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ReactRedux from 'react-redux'
import * as albumsActions from 'store/ducks/albums/actions'
import * as postsActions from 'store/ducks/posts/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as usersActions from 'store/ducks/users/actions'
import * as usersSelector from 'store/ducks/users/selectors'

const user = {
  userId: 'id123',
  username: 'username',
}

jest.spyOn(usersSelector, 'usersGetProfileSelfSelector').mockReturnValue({ data: user })
jest.spyOn(authSelector, 'authUserSelector').mockReturnValue(user)
jest.spyOn(ReactRedux, 'useDispatch')

const dispatch = jest.fn()
ReactRedux.useDispatch.mockReturnValue(dispatch)

jest.mock('components/Cache', () => jest.fn().mockReturnValue(null))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useScrollToTop: jest.fn(),
  useRoute: jest.fn(),
}))

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () => renderWithStore(<ProfileSelfScreen />)

describe('ProfileSelfScreen', () => {
  describe('initial loading', () => {
    afterEach(() => {
      dispatch.mockClear()
      authSelector.authUserSelector.mockReturnValue(user)
      useRoute.mockReturnValue({ params: {} })
      navigation.setOptions.mockClear()
    })

    it('request data for authorized user', () => {
      setup()

      expect(dispatch).toHaveBeenCalledWith(usersActions.usersGetProfileSelfRequest())
      expect(dispatch).toHaveBeenCalledWith(albumsActions.albumsGetRequest({ userId: 'id123' }))
      expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetRequest({ userId: 'id123' }))
    })

    it('request data for user from route params', () => {
      const params = { userId: 23 }
      useRoute.mockReturnValue({ params })
      setup()

      expect(dispatch).toHaveBeenCalledWith(usersActions.usersGetProfileSelfRequest())
      expect(dispatch).toHaveBeenCalledWith(albumsActions.albumsGetRequest(params))
      expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetRequest(params))
    })

    it('not load albums and posts for not authorized user', () => {
      authSelector.authUserSelector.mockReturnValue({})
      setup()

      expect(dispatch).toHaveBeenCalledWith(usersActions.usersGetProfileSelfRequest())
      expect(dispatch).toHaveBeenCalledTimes(1)
    })

    it('set username as screen title', () => {
      setup()

      expect(navigation.setOptions).toHaveBeenCalledWith({ title: user.username })
    })
  })
})
