import { render } from "@react-email/components"
import type { ReactElement } from "react"
import { Resend } from "resend"

export type EmailSenderConfig = {
	apiKey: string
	from: string
}

export type SendEmailOptions = {
	to: string | string[]
	subject: string
	template: ReactElement
}

export const createEmailSender = ({ apiKey, from }: EmailSenderConfig) => {
	const resend = new Resend(apiKey)

	return {
		sendEmail: async ({ to, subject, template }: SendEmailOptions) => {
			const html = await render(template)

			const result = await resend.emails.send({
				from,
				to: Array.isArray(to) ? to : [to],
				subject,
				html,
			})

			if (result.error) {
				throw new Error(`Failed to send email: ${JSON.stringify(result.error)}`)
			}

			return result
		},
	}
}
