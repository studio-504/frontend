import { createAction } from 'redux-actions'
import * as constants from 'store/ducks/appState/constants'

export const appStateLaunched = createAction(constants.APP_STATE_LAUNCHED)
export const appStateForeground = createAction(constants.APP_STATE_FOREGROUND)
export const appStateBackground = createAction(constants.APP_STATE_BACKGROUND)
