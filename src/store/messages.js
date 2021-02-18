import authMessages from 'store/ducks/auth/messages'
import signupMessages from 'store/ducks/signup/messages'
import usersMessages from 'store/ducks/users/messages'
import datingMessages from 'store/ducks/dating/messages'

export default Object.assign(authMessages, signupMessages, usersMessages, datingMessages)
