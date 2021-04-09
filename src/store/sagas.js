import { all } from 'redux-saga/effects'
import appState from 'store/ducks/appState/saga'
import camera from 'store/ducks/camera/saga'
import albums from 'store/ducks/albums/saga'
import chat from 'store/ducks/chat/saga'
import cache from 'store/ducks/cache/saga'
import subscriptions from 'store/ducks/subscriptions/saga'
import purchases from 'store/ducks/purchases/saga'
import contacts from 'store/ducks/contacts/saga'
import promocodes from 'store/ducks/promocodes/saga'
import contactsGrantBonusRequest from 'store/ducks/contacts/saga/contactsGrantBonusRequest'
import snackbars from 'store/ducks/snackbars/saga'
import updates from 'store/ducks/updates/saga'
import themes from 'store/ducks/themes/saga'
import analytics from 'store/ducks/analytics/saga'
import users from 'store/ducks/users/saga'

import auth from 'store/ducks/auth/saga'
import signup from 'store/ducks/signup/saga'

import datingMatchedUsers from 'store/ducks/dating/saga/datingMatchedUsers'
import datingConfirmedUsers from 'store/ducks/dating/saga/datingConfirmedUsers'
import datingMatchApprove from 'store/ducks/dating/saga/datingMatchApprove'
import datingMatchReject from 'store/ducks/dating/saga/datingMatchReject'

import posts from 'store/ducks/posts/saga'
import postsCreate from 'store/ducks/posts/saga/postsCreate'
import postsShare from 'store/ducks/posts/saga/postsShare'
import postsReportPostViews from 'store/ducks/posts/saga/postsReportPostViews'
import postsGetTrendingPosts from 'store/ducks/posts/saga/postsGetTrendingPosts'

export default function* rootSaga() {
  yield all([]
    .concat(analytics())
    .concat(snackbars())
    .concat(camera())
    .concat(albums())
    .concat(chat())
    .concat(themes())

    .concat(updates())
    .concat(cache())
    .concat(subscriptions())
    .concat(purchases())
    .concat(contacts())
    .concat(contactsGrantBonusRequest())

    .concat(users())
    .concat(promocodes())

    .concat(auth())
    .concat(signup())

    .concat(posts())
    .concat(postsCreate())
    .concat(postsShare())
    .concat(postsReportPostViews())
    .concat(postsGetTrendingPosts())

    .concat(datingMatchedUsers())
    .concat(datingConfirmedUsers())
    .concat(datingMatchApprove())
    .concat(datingMatchReject())
    .concat(appState()),
  )
}
