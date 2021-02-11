/* eslint-disable no-global-assign */
import React from 'react'
import AppLoader from 'components/AppLoader'
import { renderWithProviders } from 'tests/utils'
import { useDispatch } from 'react-redux'

jest.mock('react-redux', () => ({ useDispatch: jest.fn() }))

const dispatch = jest.fn()
useDispatch.mockReturnValue(dispatch)

const setup = () => renderWithProviders(<AppLoader />)

describe('AppLoader', () => {
  afterEach(() => {
    dispatch.mockClear()
  })

  it('dispath app launched action on mount', () => {
    setup()

    expect(dispatch).toHaveBeenCalledWith({ type: 'APP_STATE_LAUNCHED' })
  })
})
