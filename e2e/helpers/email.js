import { MailSlurp } from 'mailslurp-client'
// const mailslurp = new MailSlurp({ apiKey: '4d066a5ab39edc3f5be220c0b211b29290468611b4af39baa4dd16a48110eddb' })
//Bayram
const mailslurp = new MailSlurp({ apiKey: '24bd2575fc206fcfe6e7d1226ffa69991c7eaf056d905564ae29cfea57587700' })

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
