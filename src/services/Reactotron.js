import Reactotron, { networking } from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'
import AsyncStorage from '@react-native-community/async-storage'

export default Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure()
  .useReactNative()
  .use(networking())
  .use(
    reactotronRedux({
      except: [
        'CACHE_FETCH_REQUEST',
        'CACHE_FETCH_SUCCESS',
        'CACHE_FETCH_PROGRESS',

        'ENTITIES_ALBUMS_MERGE',
        'ENTITIES_POSTS_MERGE',
        'ENTITIES_COMMENTS_MERGE',
        'ENTITIES_USERS_MERGE',
        'ENTITIES_IMAGES_MERGE',
        'ENTITIES_CHATS_MERGE',
      ],
    }),
  )
  .use(sagaPlugin())
  .connect()
