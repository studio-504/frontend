import React from 'react'
import FeedScreen from 'screens/FeedScreen'
import { renderWithStore, act } from 'tests/utils'
import PostComponent from 'components/Post'
import { useNavigation } from '@react-navigation/native'
import * as postsActions from 'store/ducks/posts/actions'

jest.mock('components/Post', () => jest.fn().mockReturnValue(null))
jest.mock('components/Cache', () => jest.fn().mockReturnValue(null))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useScrollToTop: jest.fn(),
}))

const navigation = { navigate: jest.fn(), setOptions: jest.fn() }
useNavigation.mockReturnValue(navigation)

const setup = () => renderWithStore(<FeedScreen />)

describe('FeedScreen', () => {
  afterEach(() => {
    PostComponent.mockClear()
  })

  it('idle', () => {
    const { queryByAccessibilityLabel } = setup()

    expect(queryByAccessibilityLabel('Empty State')).toBeFalsy()
    expect(queryByAccessibilityLabel('Explore Page Banner')).toBeTruthy()
    expect(queryByAccessibilityLabel('Loader')).toBeFalsy()
    expect(PostComponent).not.toHaveBeenCalled()
  })

  it('loading state', async () => {
    const { queryByAccessibilityLabel, store } = setup()

    await act(async () => {
      store.dispatch(postsActions.postsFeedGetRequest())
    })

    expect(queryByAccessibilityLabel('Empty State')).toBeFalsy()
    expect(queryByAccessibilityLabel('Explore Page Banner')).toBeTruthy()
    expect(queryByAccessibilityLabel('Loader')).toBeTruthy()
    expect(PostComponent).not.toHaveBeenCalled()
  })

  it('empty state', async () => {
    const { queryByAccessibilityLabel, store } = setup()

    await act(async () => {
      store.dispatch(postsActions.postsFeedGetSuccess({ data: [], payload: {}, meta: {} }))
    })

    expect(queryByAccessibilityLabel('Empty State')).toBeTruthy()
    expect(queryByAccessibilityLabel('Explore Page Banner')).toBeFalsy()
    expect(queryByAccessibilityLabel('Loader')).toBeFalsy()
    expect(PostComponent).not.toHaveBeenCalled()
  })
})
