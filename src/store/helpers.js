import { createSelectorCreator, defaultMemoize } from 'reselect'
import equals from 'ramda/src/equals'

export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, equals)
