import { MailSlurp } from 'mailslurp-client'
// const mailslurp = new MailSlurp({ apiKey: '4d066a5ab39edc3f5be220c0b211b29290468611b4af39baa4dd16a48110eddb' })
//Bayram
const mailslurp = new MailSlurp({ apiKey: 'e68c599dd2e69b9de02d3758bbdacee41a081793fcbd79edf3e094c623eee49c' })

export const createInbox = async () => {
	const inbox = await mailslurp.createInbox()
	return inbox
}

export const getLatestEmail = async (inbox) => {
	const latestEmail = await mailslurp.waitForLatestEmail(inbox.id)
	return latestEmail
}

export const extractConfirmationCode = async (email) => {
	const body = email.body
	return body.split('confirmation code is ').pop().split('.')[0]
}

export const getPasswordResetCode = async (inboxId) => {
	const mails = await mailslurp.getEmails(inboxId)
	const lastMailId = mails[mails.length - 1].id
	const email = await mailslurp.getEmail(lastMailId);
	return email.body.slice(28)
}
