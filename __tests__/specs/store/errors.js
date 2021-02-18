import { createFailureAction } from 'store/errors'

describe('Store Errors', () => {
  it('failure action', () => {
    const failureAction = createFailureAction('FAILURE')
    const error = new Error('Error Message')
    const meta = { a: 1, b: 2 }

    expect(failureAction(error)).toEqual({ type: 'FAILURE', payload: error, error: true, meta: {} })
    expect(failureAction(error, meta)).toEqual({ type: 'FAILURE', payload: error, error: true, meta })
  })
})
