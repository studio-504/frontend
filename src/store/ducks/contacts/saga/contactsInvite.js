import { Linking } from 'react-native'
import { put, call } from 'redux-saga/effects'
import * as actions from 'store/ducks/contacts/actions'

function* contactsInviteRequest(req) {
  try {
    const { user, contact } = req.payload
    const subject = 'Invite to REAL.app'
    const body = 'https://apps.apple.com/us/app/real-social-media/id1485194570?ls=1'

    if (contact.type === 'email') {
      yield call([Linking, 'openURL'], `mailto:${contact.value}?subject=${subject}&body=${body}`)
    } else if (contact.type === 'phone') {
      yield call([Linking, 'openURL'], `sms:${contact.value}&body=${body}`)
    } else {
      throw new Error('Invite supports only email and phone type')
    }

    yield put(actions.contactsInviteSuccess(user))
  } catch (error) {
    yield put(actions.contactsInviteFailure(error.message))
  }
}

export default contactsInviteRequest
