import prop from 'ramda/src/prop'
import compose from 'ramda/src/compose'

const contacts = prop('contacts')
export const contactsGet = compose(prop('contactsGet'), contacts)
