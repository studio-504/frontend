import { userFragment } from 'store/fragments'

export const findUsers = `
  query findUsers($emails: [AWSEmail!]!, $phoneNumbers: [AWSPhone!]!) {
    findUsers(emails: $emails, phoneNumbers: $phoneNumbers) {
      items {
        ...userFragment
      }
    }
  }
  ${userFragment}
`
