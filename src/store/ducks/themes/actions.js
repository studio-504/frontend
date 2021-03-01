import { createAction } from 'redux-actions'
import { createFailureAction } from 'store/errors'
import * as constants from 'store/ducks/themes/constants'

/**
 *
 */
export const themesCheckDefaultRequest = createAction(constants.THEMES_CHECK_DEFAULT_REQUEST)
export const themesCheckDefaultSuccess = createAction(constants.THEMES_CHECK_DEFAULT_SUCCESS)
export const themesCheckDefaultFailure = createFailureAction(constants.THEMES_CHECK_DEFAULT_FAILURE)

/**
 *
 */
export const themesEditRequest = createAction(constants.THEMES_EDIT_REQUEST)
export const themesEditSuccess = createAction(constants.THEMES_EDIT_SUCCESS)
export const themesEditFailure = createFailureAction(constants.THEMES_EDIT_FAILURE)
