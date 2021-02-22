import authMessages from 'store/ducks/auth/messages'
import signupMessages from 'store/ducks/signup/messages'
import usersMessages from 'store/ducks/users/messages'
import datingMessages from 'store/ducks/dating/messages'
import contactsMessages from 'store/ducks/contacts/messages'

export default Object.assign(authMessages, signupMessages, usersMessages, datingMessages, contactsMessages)
