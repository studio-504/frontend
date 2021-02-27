import { combineReducers } from 'redux'
import { testReducer } from 'tests/utils/helpers'
import promocodes from 'store/ducks/promocodes/reducer'
import * as actions from 'store/ducks/promocodes/actions'
import * as selectors from 'store/ducks/promocodes/selectors'

const reducer = combineReducers({ promocodes })

describe('Promocodes reducer', () => {
  describe('promoCodesRedeem', () => {
    it('idle', () => {
      testReducer(reducer).expect(selectors.promoCodesRedeem, { status: 'idle' })
    })

    it('loading', () => {
      testReducer(reducer)
        .put(actions.promoCodesRedeemRequest())
        .expect(selectors.promoCodesRedeem, { status: 'loading' })
    })

    it('success', () => {
      testReducer(reducer)
        .put(actions.promoCodesRedeemSuccess())
        .expect(selectors.promoCodesRedeem, { status: 'success' })
    })

    it('failure', () => {
      const error = new Error('Error')

      testReducer(reducer)
        .put(actions.promoCodesRedeemFailure(error))
        .expect(selectors.promoCodesRedeem, { status: 'failure' })
    })
  })
})
