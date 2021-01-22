import compose from 'ramda/src/compose'
import pathOr from 'ramda/src/pathOr'
import path from 'ramda/src/path'
import filter from 'ramda/src/filter'
import equals from 'ramda/src/equals'

export const hasActiveStories = compose(
  pathOr(false, 'length'),
  filter((post) => post.viewedStatus === 'NOT_VIEWED'),
  pathOr([], ['stories', 'items']),
)

export const isUserOwner = compose(equals('SELF'), path(['data', 'followedStatus']))
export const isUserActive = compose(equals('ACTIVE'), pathOr({}, ['userStatus']))
export const isUserAnonymous = compose(equals('ANONYMOUS'), pathOr({}, ['userStatus']))