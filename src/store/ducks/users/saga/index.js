import { put, takeLatest, call } from 'redux-saga/effects'
import path from 'ramda/src/path'
import compose from 'ramda/src/compose'
import omit from 'ramda/src/omit'
import * as actions from 'store/ducks/users/actions'
import * as queries from 'store/ducks/users/queries'
import * as constants from 'store/ducks/users/constants'
import * as queryService from 'services/Query'
import * as normalizer from 'normalizer/schemas'
import usersCheckPermissions from 'store/ducks/users/saga/usersCheckPermissions'
import usersImagePostsGetRequest from 'store/ducks/users/saga/usersImagePostsGetRequest'
import usersGetProfileSelfRequest from 'store/ducks/users/saga/usersGetProfileSelfRequest'
import usersSetUserDatingStatusRequest from 'store/ducks/users/saga/usersSetUserDatingStatus'
import * as LinkingService from 'services/Linking'
import { entitiesMerge } from 'store/ducks/entities/saga'

/**
 *
 */
function* usersSearchRequestData(req, api) {
  const dataSelector = path(['data', 'searchUsers', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'searchUsers']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUsersGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersSearchRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.searchUsers, req.payload)
    const next = yield usersSearchRequestData(req, data)
    yield put(actions.usersSearchSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersSearchFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersDeleteRequestData(req, api) {
  const dataSelector = path(['data', 'deleteUser'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersDeleteRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.deleteUser, req.payload)
    const next = yield usersDeleteRequestData(req, data)
    yield put(actions.usersDeleteSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersDeleteFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersGetFollowerUsersRequestData(req, api) {
  const dataSelector = path(['data', 'user', 'followerUsers', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'user', 'followerUsers']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUsersGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersGetFollowerUsersRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.getFollowerUsers, req.payload)
    const next = yield usersGetFollowerUsersRequestData(req, data)
    yield put(actions.usersGetFollowerUsersSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersGetFollowerUsersFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersGetFollowedUsersRequestData(req, api) {
  const dataSelector = path(['data', 'user', 'followedUsers', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'user', 'followedUsers']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUsersGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersGetFollowedUsersRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.getFollowedUsers, req.payload)
    const next = yield usersGetFollowedUsersRequestData(req, data)
    yield put(actions.usersGetFollowedUsersSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersGetFollowedUsersFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersGetPendingFollowersRequestData(req, api) {
  const dataSelector = path(['data', 'user', 'followerUsers', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'user', 'followerUsers']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUsersGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersGetPendingFollowersRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.getFollowerUsers, { ...req.payload, followStatus: 'REQUESTED' })
    const next = yield usersGetPendingFollowersRequestData(req, data)
    yield put(actions.usersGetPendingFollowersSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersGetPendingFollowersFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersGetFollowedUsersWithStoriesRequestData(req, api) {
  const dataSelector = path(['data', 'self', 'followedUsersWithStories', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'self', 'followedUsersWithStories']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUsersGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersGetFollowedUsersWithStoriesRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.getFollowedUsersWithStories, req.payload)
    const next = yield usersGetFollowedUsersWithStoriesRequestData(req, data)
    yield put(actions.usersGetFollowedUsersWithStoriesSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersGetFollowedUsersWithStoriesFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersAcceptFollowerUserRequestData(req, api) {
  const dataSelector = path(['data', 'acceptFollowerUser'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersAcceptFollowerUserRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.acceptFollowerUser, req.payload)
    const next = yield usersAcceptFollowerUserRequestData(req, data)
    yield put(actions.usersAcceptFollowerUserSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersAcceptFollowerUserFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersDeclineFollowerUserRequestData(req, api) {
  const dataSelector = path(['data', 'denyFollowerUser'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersDeclineFollowerUserRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.denyFollowerUser, req.payload)
    const next = yield usersDeclineFollowerUserRequestData(req, data)
    yield put(actions.usersDeclineFollowerUserSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersDeclineFollowerUserFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersGetProfileRequestData(req, api) {
  const dataSelector = path(['data', 'user'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersGetProfileRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.user, req.payload)
    const next = yield usersGetProfileRequestData(req, data)
    yield put(actions.usersGetProfileSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersGetProfileFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersEditProfileRequestData(req, api) {
  const dataSelector = path(['data', 'setUserDetails'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)

  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersEditProfileRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.setUserDetails, req.payload)
    const next = yield usersEditProfileRequestData(req, data)
    yield put(actions.usersEditProfileSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    const errorMessage = path(['errors', '0', 'message'])(error)

    if (errorMessage && errorMessage.includes('is not verified')) {
      yield put(actions.usersEditProfileFailure(error, { errorCode: 'VERIFICATION_FAILED' }))
    } else {
      yield put(actions.usersEditProfileFailure(error))
    }
  }
}

/**
 *
 */
function* usersDeleteProfilePhoto() {
  try {
    const req = { payload: { photoPostId: '' } }
    const data = yield queryService.apiRequest(queries.setUserDetails, req.payload)

    yield usersEditProfileRequestData(req, data)
    yield put(actions.usersDeleteAvatarSuccess())
  } catch (error) {
    yield put(actions.usersDeleteAvatarFailure(error))
  }
}

/**
 *
 */
function* usersChangeAvatarRequest(req) {
  try {
    const photoPostId = req.payload.postId
    const data = yield call([queryService, 'apiRequest'], queries.setUserDetails, { photoPostId })

    yield usersEditProfileRequestData(req, data)
    yield put(actions.usersChangeAvatarSuccess())
  } catch (error) {
    yield put(actions.usersChangeAvatarFailure(error))
  }
}

/**
 *
 */
function* usersFollowRequestData(req, api) {
  const dataSelector = path(['data', 'followUser'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersFollowRequest(req) {
  try {
    yield call(usersCheckPermissions)
    const data = yield queryService.apiRequest(queries.followUser, req.payload)
    const next = yield usersFollowRequestData(req, data)
    yield put(actions.usersFollowSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersFollowFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersUnfollowRequestData(req, api) {
  const dataSelector = path(['data', 'unfollowUser'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersUnfollowRequest(req) {
  try {
    yield call(usersCheckPermissions)
    const data = yield queryService.apiRequest(queries.unfollowUser, req.payload)
    const next = yield usersUnfollowRequestData(req, data)
    yield put(actions.usersUnfollowSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersUnfollowFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersBlockRequestData(req, api) {
  const dataSelector = path(['data', 'blockUser'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersBlockRequest(req) {
  try {
    yield call(usersCheckPermissions)
    const data = yield queryService.apiRequest(queries.blockUser, req.payload)
    const next = yield usersBlockRequestData(req, data)
    yield put(actions.usersBlockSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersBlockFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersUnblockRequestData(req, api) {
  const dataSelector = path(['data', 'unblockUser'])

  const data = dataSelector(api)
  const meta = {}
  const payload = req.payload

  const normalized = normalizer.normalizeUserGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersUnblockRequest(req) {
  try {
    yield call(usersCheckPermissions)
    const data = yield queryService.apiRequest(queries.unblockUser, req.payload)
    const next = yield usersUnblockRequestData(req, data)
    yield put(actions.usersUnblockSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersUnblockFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersGetTrendingUsersRequestData(req, api) {
  const dataSelector = path(['data', 'trendingUsers', 'items'])
  const metaSelector = compose(omit(['items']), path(['data', 'trendingUsers']))

  const data = dataSelector(api)
  const meta = metaSelector(api)
  const payload = req.payload

  const normalized = normalizer.normalizeUsersGet(data)
  yield entitiesMerge(normalized)

  return {
    data: normalized.result,
    meta,
    payload,
  }
}

function* usersGetTrendingUsersRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.trendingUsers, req.payload)
    const next = yield usersGetTrendingUsersRequestData(req, data)
    yield put(actions.usersGetTrendingUsersSuccess({ data: next.data, payload: next.payload, meta: next.meta }))
  } catch (error) {
    yield put(actions.usersGetTrendingUsersFailure(error, req.payload))
  }
}

const isCardSupported = (card) => {
  try {
    return LinkingService.deeplinkPath(card.action)
  } catch (error) {
    return false
  }
}

/**
 *
 */
function* usersGetCardsRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.getCards, req.payload)
    const selector = path(['data', 'self', 'cards', 'items'])
    const metaSelector = compose(omit(['items']), path(['data', 'self', 'cards']))

    yield put(actions.usersGetCardsSuccess({ 
      payload: req.payload, 
      data: selector(data).filter(isCardSupported), 
      meta: metaSelector(data),
    }))
  } catch (error) {
    yield put(actions.usersGetCardsFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersDeleteCardRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.deleteCard, req.payload)
    const selector = path(['data', 'deleteCard'])

    yield put(actions.usersDeleteCardSuccess({ payload: req.payload, data: selector(data), meta: {} }))
  } catch (error) {
    yield put(actions.usersDeleteCardFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersSetApnsTokenRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.setUserAPNSToken, req.payload)

    yield put(actions.usersSetApnsTokenSuccess({ payload: req.payload, data, meta: {} }))
  } catch (error) {
    yield put(actions.usersSetApnsTokenFailure(error, req.payload))
  }
}

/**
 *
 */
function* usersReportScreenViewsRequest(req) {
  try {
    const data = yield queryService.apiRequest(queries.reportScreenViews, req.payload)

    yield put(actions.usersReportScreenViewsSuccess({ payload: req.payload, data, meta: {} }))
  } catch (error) {
    yield put(actions.usersReportScreenViewsFailure(error, req.payload))
  }
} 

export default () => [
  takeLatest(constants.USERS_SEARCH_REQUEST, usersSearchRequest),
  takeLatest(constants.USERS_DELETE_REQUEST, usersDeleteRequest),
  takeLatest(constants.USERS_GET_FOLLOWED_USERS_WITH_STORIES_REQUEST, usersGetFollowedUsersWithStoriesRequest),
  takeLatest(constants.USERS_GET_FOLLOWER_USERS_REQUEST, usersGetFollowerUsersRequest),
  takeLatest(constants.USERS_GET_FOLLOWED_USERS_REQUEST, usersGetFollowedUsersRequest),
  takeLatest(constants.USERS_GET_PENDING_FOLLOWERS_REQUEST, usersGetPendingFollowersRequest),
  takeLatest(constants.USERS_ACCEPT_FOLLOWER_USER_REQUEST, usersAcceptFollowerUserRequest),
  takeLatest(constants.USERS_DECLINE_FOLLOWER_USER_REQUEST, usersDeclineFollowerUserRequest),
  takeLatest(constants.USERS_FOLLOW_REQUEST, usersFollowRequest), 
  takeLatest(constants.USERS_UNFOLLOW_REQUEST, usersUnfollowRequest),
  takeLatest(constants.USERS_BLOCK_REQUEST, usersBlockRequest),
  takeLatest(constants.USERS_UNBLOCK_REQUEST, usersUnblockRequest),
  takeLatest(constants.USERS_GET_PROFILE_REQUEST, usersGetProfileRequest),
  takeLatest(constants.USERS_GET_PROFILE_SELF_REQUEST, usersGetProfileSelfRequest),
  takeLatest(constants.USERS_EDIT_PROFILE_REQUEST, usersEditProfileRequest),
  takeLatest(constants.USERS_IMAGE_POSTS_GET_REQUEST, usersImagePostsGetRequest),
  takeLatest(constants.USERS_GET_TRENDING_USERS_REQUEST, usersGetTrendingUsersRequest),
  takeLatest(constants.USERS_GET_CARDS_REQUEST, usersGetCardsRequest),
  takeLatest(constants.USERS_DELETE_CARD_REQUEST, usersDeleteCardRequest),
  takeLatest(constants.USERS_SET_APNS_TOKEN_REQUEST, usersSetApnsTokenRequest),
  takeLatest(constants.USERS_DELETE_AVATAR_REQUEST, usersDeleteProfilePhoto),
  takeLatest(constants.USERS_REPORT_SCREEN_VIEWS_REQUEST, usersReportScreenViewsRequest),
  takeLatest(constants.USERS_CHANGE_AVATAR_REQUEST, usersChangeAvatarRequest),
  takeLatest(constants.USERS_SET_USER_DATING_STATUS_REQUEST, usersSetUserDatingStatusRequest),
]