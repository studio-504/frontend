/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "testFilter"] }] */
import React from 'react'
import { useDispatch } from 'react-redux'
import { renderWithProviders } from 'tests/utils'
import * as postsSelector from 'store/ducks/posts/selectors'
import * as usersActions from 'store/ducks/users/actions'
import SearchScreen from 'screens/SearchScreen'
import { SearchFeedProvider } from 'components/Search/Context'

jest.mock('react-redux', () => ({ useDispatch: jest.fn(), useSelector: (i) => i }))
jest.mock('@react-navigation/native', () => ({ useNavigation: jest.fn(), useScrollToTop: jest.fn() }))
jest.mock('store/ducks/posts/selectors', () => ({ postsGetTrendingPostsSelector: jest.fn() }))

const setup = (props) =>
  renderWithProviders(
    <SearchFeedProvider>
      <SearchScreen {...props} />
    </SearchFeedProvider>,
  )

describe('Search screen', () => {
  const dispatch = jest.fn()

  beforeAll(() => {
    postsSelector.postsGetTrendingPostsSelector.mockReturnValue({ data: [], filters: {} })
    useDispatch.mockReturnValue(dispatch)
  })

  afterEach(() => {
    dispatch.mockClear()
  })

  it('initial fetch', () => {
    setup()

    expect(dispatch).toHaveBeenCalledWith(usersActions.usersGetTrendingUsersRequest({ limit: 30 }))
  })
})
