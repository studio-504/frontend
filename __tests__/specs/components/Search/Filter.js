/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "testFilterButtons"] }] */
import React from 'react'
import { renderWithProviders, fireEvent, within } from 'tests/utils'
import FilterComponent from 'components/Search/Filter'

const callbacks = {
  handlePostsAllFilter: jest.fn(),
  handlePostsViewedFilter: jest.fn(),
  handlePostsNotViewedFilter: jest.fn(),
  handlePostsVerifiedFilter: jest.fn(),
  handlePostsNotVerifiedFilter: jest.fn(),
}

const setup = (props) => renderWithProviders(<FilterComponent {...props} />)

const testFilterButtons = (holder, expected) => {
  const { getAllByRole } = holder
  const $buttons = getAllByRole('button')

  const testName = ($button, name) => {
    expect(within($button).getByText(name)).toBeTruthy()
  }

  const testIsActive = ($button, selected) => {
    expect($button).toHaveProp('accessibilityState', { selected })
  }

  const testCallback = ($button, fn) => {
    expect(fn).not.toHaveBeenCalled()
    fireEvent.press($button)
    expect(fn).toHaveBeenCalled()
  }

  testName($buttons[0], 'All')
  testIsActive($buttons[0], expected.all.isActive)
  testCallback($buttons[0], callbacks.handlePostsAllFilter)

  testName($buttons[1], 'Verified')
  testIsActive($buttons[1], expected.verified.isActive)
  testCallback($buttons[1], callbacks.handlePostsVerifiedFilter)

  testName($buttons[2], 'Unverified')
  testIsActive($buttons[2], expected.unverified.isActive)
  testCallback($buttons[2], callbacks.handlePostsNotVerifiedFilter)

  testName($buttons[3], 'Viewed')
  testIsActive($buttons[3], expected.viewed.isActive)
  testCallback($buttons[3], callbacks.handlePostsViewedFilter)

  testName($buttons[4], 'Unviewed')
  testIsActive($buttons[4], expected.unviewed.isActive)
  testCallback($buttons[4], callbacks.handlePostsNotViewedFilter)
}

describe('Search filter component', () => {
  afterEach(() => {
    Object.values(callbacks).forEach((fn) => fn.mockClear())
  })

  it('All', () => {
    const holder = setup({
      trendingFilters: {
        viewedStatus: undefined,
        verifiedStatus: undefined,
        ...callbacks,
      },
    })

    testFilterButtons(holder, {
      all: { isActive: true },
      verified: { isActive: false },
      unverified: { isActive: false },
      viewed: { isActive: false },
      unviewed: { isActive: false },
    })
  })

  it('Verified', () => {
    const holder = setup({
      trendingFilters: {
        viewedStatus: undefined,
        verifiedStatus: true,
        ...callbacks,
      },
    })

    testFilterButtons(holder, {
      all: { isActive: false },
      verified: { isActive: true },
      unverified: { isActive: false },
      viewed: { isActive: false },
      unviewed: { isActive: false },
    })
  })

  it('Unverified', () => {
    const holder = setup({
      trendingFilters: {
        viewedStatus: undefined,
        verifiedStatus: false,
        ...callbacks,
      },
    })

    testFilterButtons(holder, {
      all: { isActive: false },
      verified: { isActive: false },
      unverified: { isActive: true },
      viewed: { isActive: false },
      unviewed: { isActive: false },
    })
  })

  it('Viewed', () => {
    const holder = setup({
      trendingFilters: {
        viewedStatus: 'VIEWED',
        verifiedStatus: undefined,
        ...callbacks,
      },
    })

    testFilterButtons(holder, {
      all: { isActive: false },
      verified: { isActive: false },
      unverified: { isActive: false },
      viewed: { isActive: true },
      unviewed: { isActive: false },
    })
  })

  it('Unviewed', () => {
    const holder = setup({
      trendingFilters: {
        viewedStatus: 'NOT_VIEWED',
        verifiedStatus: undefined,
        ...callbacks,
      },
    })

    testFilterButtons(holder, {
      all: { isActive: false },
      verified: { isActive: false },
      unverified: { isActive: false },
      viewed: { isActive: false },
      unviewed: { isActive: true },
    })
  })
})
