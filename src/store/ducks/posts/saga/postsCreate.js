import { graphqlOperation } from '@aws-amplify/api'
import { call, put, takeEvery, getContext, take, spawn, delay, race, retry } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import path from 'ramda/src/path'
import pathEq from 'ramda/src/pathEq'
import compose from 'ramda/src/compose'
import toLower from 'ramda/src/toLower'
import replace from 'ramda/src/replace'
import * as actions from 'store/ducks/posts/actions'
import * as queries from 'store/ducks/posts/queries'
import * as constants from 'store/ducks/posts/constants'
import * as subscriptionsActions from 'store/ducks/subscriptions/actions'
import * as subscriptionsConstants from 'store/ducks/subscriptions/constants'
import * as usersActions from 'store/ducks/users/actions'
import * as cameraActions from 'store/ducks/camera/actions'
import * as queryService from 'services/Query'
import RNFS from 'react-native-fs'
import filePath from 'path'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'

function initPostsCreateUploadChannel({ image, uploadUrl, payload }) {
  const getName = (image) => {
    return compose(
      replace('.heic', ''),
      replace('.jpg', ''),
      toLower,
      filePath.basename,
    )(image)
  }

  const getFilename = (image) => {
    return compose(
      toLower,
      filePath.basename,
    )(image)
  }

  const getFilepath = (image) => {
    return image
  }

  const getFiletype = () => {
    if (toLower(payload.imageFormat) === 'heic') {
      return 'image/heic'
    }
    return 'image/jpeg'
  }

  const files = [{
    name: getName(image),
    filename: getFilename(image),
    filepath: getFilepath(image),
    filetype: getFiletype(image),
  }]

  const handleRequest = (emitter) => (response) => {
    const jobId = response.jobId
    emitter({ status: 'retry', progress: 0, jobId })
  }

  const handleProgress = (emitter) => (response) => {
    const jobId = response.jobId
    const progress = parseInt(response.totalBytesSent / response.totalBytesExpectedToSend * 100, 10)

    if (progress % 10 === 0) {
      const nextProgress = progress === 100 ? 99 : progress
      emitter({ status: 'progress', progress: nextProgress, jobId })
    }
  }

  const handleSuccess = (emitter) => (response) => {
    const jobId = response.jobId
    emitter({ status: 'success', progress: 99, jobId })
    emitter(END)
  }

  const handleFailure = (emitter) => () => {
    emitter({ status: 'failure', progress: 0 })
    emitter(END)
  }

  const initUpload = () => (begin, progress) =>
    RNFS.uploadFiles({
      binaryStreamOnly: true,
      toUrl: uploadUrl,
      files: files,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      begin,
      progress,
    })

  /**
   *
   */
  return eventChannel((emitter) => {
    const uploader = initUpload(emitter)(
      handleRequest(emitter),
      handleProgress(emitter),
    )

    const next = (response) => {
      if (response.statusCode === 200) {
        handleSuccess(emitter)(response)
      } else {
        handleFailure(emitter)(response)
      }
    }

    const fail = (error) => {
      handleFailure(emitter)(error)
    }

    uploader.promise
      .then(next)
      .catch(fail)

    return () => {
      RNFS.stopUpload(uploader.jobId)
    }
  })
}

function* handlePostsCreateRequest(payload) {
  const AwsAPI = yield getContext('AwsAPI')

  const data = yield (function* getPost() {
    try {
      const post = yield AwsAPI.graphql(graphqlOperation(queries.getPost, payload))
      if (!post.data.post) {
        throw new Error('Post must be created')
      }
      return post.data.post
    } catch (error) {
      const post = yield AwsAPI.graphql(graphqlOperation(queries.addPhotoPost, payload))
      return post.data.addPost
    }
  })()

  return {
    userId: data.postedBy.userId,
    imageUrl: data.imageUploadUrl,
    image: path(['images', 0])(payload),
  }
}

/**
 *
 */
function* handleTextOnlyPost(post) {
  const AwsAPI = yield getContext('AwsAPI')

  try {
    yield AwsAPI.graphql(graphqlOperation(queries.addTextOnlyPost, post))
    yield put(actions.postsCreateSuccess({ data: {}, payload: post, meta: {} }))
  } catch (error) {
    yield put(actions.postsCreateFailure(error, post))
  }
}

/**
 *
 */
function* handlePostsCreateSuccess(post) {
  const userId = path(['postedBy', 'userId'], post)
  yield put(actions.postsCreateSuccess({ data: {}, payload: post, meta: {} }))
  yield put(actions.postsGetRequest({ userId }))
  yield put(usersActions.usersImagePostsGetRequest({ userId, isVerified: true }))
  yield put(actions.postsFeedGetRequest({ limit: 20 }))
}

function* handlePostsCreateFailure(error, post) {
  yield put(actions.postsCreateFailure(error, post))
}

/**
 *
 */
export function* checkPostsCreateProcessing(processingPost) {
  const TIMEOUT_DELAY = 5000
  const matchPostId = pathEq(['payload', 'postId'], processingPost.postId)

  function* checkRequest() {
    const response = yield call([queryService, 'apiRequest'], queries.getPost, processingPost)
    const post = path(['data', 'post'], response)
    const postStatus = path(['postStatus'], post)

    if (['PENDING', 'PROCESSING'].includes(postStatus)) {
      throw new Error('Post has not been processed')
    }

    if (['ERROR', 'ARCHIVED', 'DELETING'].includes(postStatus)) {
      const error = new Error('Post shouldn`t have ERROR, ARCHIVED or DELETING status')
      yield* handlePostsCreateFailure(error, post)
    }

    if (['COMPLETED'].includes(postStatus)) {
      yield* handlePostsCreateSuccess(post)
    }
  }

  try {
    const { completed, error, timeout } = yield race({
      completed: take(subscriptionsConstants.SUBSCRIPTIONS_POST_COMPLETED),
      error: take(subscriptionsConstants.SUBSCRIPTIONS_POST_ERROR),
      timeout: delay(TIMEOUT_DELAY),
    })

    if (matchPostId(completed) || matchPostId(error) || timeout) {
      yield retry(3, TIMEOUT_DELAY, checkRequest)
    } else {
      yield spawn(checkPostsCreateProcessing, processingPost)
    }
  } catch (error) {
    yield* handlePostsCreateFailure(error, processingPost)
  }
}

/**
 *
 */
function* handleImagePost(post) {
  try {
    const data = yield handlePostsCreateRequest(post)

    const channel = yield call(initPostsCreateUploadChannel, {
      uploadUrl: data.imageUrl,
      image: data.image,
      payload: post,
    })

    yield takeEvery(channel, function *(upload) {
      const meta = (nextProgress) => ({
        attempt: upload.attempt || post.attempt,
        progress: nextProgress || parseInt(upload.progress, 10),
        error: upload.error,
        jobId: upload.jobId,
      })

      if (upload.status === 'progress') {
        yield put(actions.postsCreateProgress({ data: {}, payload: post, meta: meta() }))
      }

      if (upload.status === 'success') {
        yield put(actions.postsCreateProgress({ data: {}, payload: post, meta: meta(99) }))
        yield spawn(checkPostsCreateProcessing, post)
      }

      if (upload.status === 'failure') {
        throw new Error('Posts Create Failure')
      }
    })
  } catch (error) {
    yield put(actions.postsCreateFailure(error, post))
  }
}

/**
 *
 */
const postUploadDefaultValues = (post) => ({
  postId: post.postId || uuid(),
  mediaId: post.mediaId || uuid(),
  createdAt: post.createdAt || dayjs().toJSON(),
  attempt: post.attempt || 0,

  albumId: post.albumId || null,
  postType: post.postType || 'IMAGE',
  text: post.text || '',
  images: post.images || [],
  preview: post.preview || [],
  lifetime: post.lifetime || '',
  commentsDisabled: post.commentsDisabled || false,
  likesDisabled: post.likesDisabled || false,
  sharingDisabled: post.sharingDisabled || false,
  verificationHidden: post.verificationHidden || false,
  takenInReal: post.takenInReal || false,
  originalFormat: post.originalFormat || 'jpg',
  originalMetadata: post.originalMetadata || '',
  imageFormat: post.imageFormat || 'JPEG',
  crop: post.crop || null,
})

function* postsCreateRequest(req) {
  const post = postUploadDefaultValues(req.payload)

  yield put(subscriptionsActions.subscriptionsMainRequest())
  yield put(subscriptionsActions.subscriptionsPollRequest())

  if (post.postType === 'TEXT_ONLY') {
    return yield handleTextOnlyPost(post)
  }

  if (post.postType === 'IMAGE') {
    return yield handleImagePost(post)
  }

  /**
   * Remove uploaded photo from camera queue
   */
  if (post.postType === 'IMAGE' && post.images.length) {
    yield put(cameraActions.cameraCaptureIdle({ payload: { uri: post.images[0] } }))
  }
}

/**
 *
 */
function* postsCreateIdle(req) {
  const jobId = path(['payload', 'meta', 'jobId'])(req)

  if (jobId) {
    yield RNFS.stopUpload(jobId)
  }
}


export default () => [
  takeEvery(constants.POSTS_CREATE_REQUEST, postsCreateRequest),
  takeEvery(constants.POSTS_CREATE_IDLE, postsCreateIdle),
]
