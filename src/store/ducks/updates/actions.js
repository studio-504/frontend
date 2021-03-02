import { createAction } from 'redux-actions'
import * as constants from 'store/ducks/updates/constants'

export const updatesCheckRequest = createAction(constants.UPDATES_CHECK_REQUEST)
