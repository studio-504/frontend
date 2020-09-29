import { useDispatch, useSelector } from 'react-redux'
import * as actions from 'store/ducks/contacts/actions'
import * as selectors from 'store/ducks/contacts/selectors'

const InviteFriendsService = ({ children }) => {
  const dispatch = useDispatch()
  const contactsGet = useSelector(selectors.contactsGet)
  const contactsGetRequest = () => dispatch(actions.contactsGetRequest())

  return children({
    contactsGetRequest,
    contactsGet,
  })
}

export default InviteFriendsService
