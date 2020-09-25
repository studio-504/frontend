import prop from 'ramda/src/prop'
import compose from 'ramda/src/compose'

export const purchases = prop('purchases')
export const purchasesRequest = compose(prop('purchasesRequest'), purchases)