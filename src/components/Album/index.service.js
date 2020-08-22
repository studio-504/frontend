import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as albumsActions from 'store/ducks/albums/actions'
import * as postsActions from 'store/ducks/posts/actions'
import * as navigationActions from 'navigation/actions'
import * as authSelector from 'store/ducks/auth/selectors'
import * as albumsSelector from 'store/ducks/albums/selectors'
import path from 'ramda/src/path'

const AlbumService = ({ children }) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const route = useRoute()
  const albumId = route.params.album.albumId
  const user = useSelector(authSelector.authUserSelector)
  const themeFetch = useSelector(state => state.theme.themeFetch)
  const albumsDelete = useSelector(state => state.albums.albumsDelete)
  const albumsSingleGet = useSelector(albumsSelector.albumsSingleGetSelector(albumId))
  const albumsPostsGet = useSelector(albumsSelector.albumsPostsGetSelector(albumId))

  const albumsPostsGetRequest = (payload) =>
    dispatch(albumsActions.albumsPostsGetRequest(payload))

  const albumsPostsGetMoreRequest = (payload) =>
    dispatch(albumsActions.albumsPostsGetMoreRequest(payload))

  const albumsDeleteRequest = (payload) =>
    dispatch(albumsActions.albumsDeleteRequest(payload))

  useEffect(() => {
    dispatch(albumsActions.albumsPostsGetRequest({ albumId }))
  }, [])

  useEffect(() => {
    if (albumsDelete.status === 'success') {
      dispatch(albumsActions.albumsDeleteIdle({}))
      dispatch(albumsActions.albumsGetRequest({ userId: user.userId }))
      navigationActions.navigateBack(navigation)()
    }
  }, [albumsDelete.status])

  const onViewableItemsChanged = ({ viewableItems }) => {
    const postIds = viewableItems.map(viewable => path(['item', 'postId'])(viewable))
      .filter(item => item)

    if (!Array.isArray(postIds) || !postIds.length) {
      return
    }

    dispatch(postsActions.postsReportPostViewsRequest({ postIds }))
  }

  const onViewableItemsChangedRef = useRef(onViewableItemsChanged)
  const viewabilityConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 30,
    waitForInteraction: false,
  })

  return children({
    user,
    themeFetch,
    albumsSingleGet,
    albumsPostsGet,
    albumsPostsGetRequest,
    albumsPostsGetMoreRequest,
    albumsDeleteRequest,
    onViewableItemsChangedRef,
    viewabilityConfigRef,
  })
}

export default AlbumService
