import React from 'react'
import { useDispatch } from 'react-redux'
import { renderWithProviders, fireEvent } from 'tests/utils'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as usersActions from 'store/ducks/users/actions'
import * as postsActions from 'store/ducks/posts/actions'
import SearchScreen from 'screens/SearchScreen'

jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: (i) => i }))
jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn(), useScrollToTop: jest.fn() }))
jest.mock('store/ducks/posts/selectors', () => ({ postsGetTrendingPostsSelector: jest.fn() }))

const setup = () => renderWithProviders(<SearchScreen />)

describe('Search screen', () => {
  const dispatch = jest.fn()

  beforeAll(() => {
    postsSelector.postsGetTrendingPostsSelector.mockReturnValue({ data: [] })
    useDispatch.mockReturnValue(dispatch)
  })

  afterEach(() => {
    dispatch.mockClear()
  })

  it('initial fetch', () => {
    setup()

    const fetchAllTrendingPosts = { viewedStatus: undefined, isVerified: undefined }
    expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetTrendingPostsRequest(fetchAllTrendingPosts))
    expect(dispatch).toHaveBeenCalledWith(usersActions.usersGetTrendingUsersRequest({ limit: 30 }))
  })

  it('Filters', () => {
    const { getByText } = setup()

    const testFilter = ({ name, payload }) => {
      dispatch.mockClear()
      fireEvent.press(getByText(name))
      expect(dispatch).toHaveBeenCalledWith(postsActions.postsGetTrendingPostsRequest(payload))
      dispatch.mockClear()
      fireEvent.press(getByText(name))
      expect(dispatch).not.toHaveBeenCalled()
    }

    testFilter({ name: 'Verified', payload: { isVerified: true, viewedStatus: undefined } })
    testFilter({ name: 'Unverified', payload: { isVerified: false, viewedStatus: undefined } })
    testFilter({ name: 'Viewed', payload: { isVerified: undefined, viewedStatus: 'VIEWED' } })
    testFilter({ name: 'Unviewed', payload: { isVerified: undefined, viewedStatus: 'NOT_VIEWED' } })
    testFilter({ name: 'All', payload: { isVerified: undefined, viewedStatus: undefined } })
  })
})
