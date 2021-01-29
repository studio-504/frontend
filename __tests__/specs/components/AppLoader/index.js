/* eslint-disable no-global-assign */
import React from 'react'
import AppLoader from 'components/AppLoader'
import { renderWithProviders } from 'tests/utils'
import * as Updates from 'services/Updates'
import { useDispatch } from 'react-redux'

jest.mock('services/Updates', () => ({ versionCheck: jest.fn() }))
jest.mock('react-redux', () => ({ useDispatch: jest.fn() }))

const dispatch = jest.fn()
useDispatch.mockReturnValue(dispatch)

const setup = () => renderWithProviders(<AppLoader />)

describe('AppLoader', () => {
  afterEach(() => {
    dispatch.mockClear()
  })

  it('versionCheck on mount', () => {
    setup()

    expect(Updates.versionCheck).toHaveBeenCalled()
  })

  it('start auth flow on mount', () => {
    setup()

    expect(dispatch).toHaveBeenCalledWith({ type: 'AUTH_FLOW_REQUEST', payload: { allowAnonymous: false } })
  })
})
