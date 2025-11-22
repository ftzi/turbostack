/**
 * Here we have some internal logic to send emails using Resend and react-email.
 *
 * You shouldn't need to change this file.
 */
import "server-only";
import { render } from "@react-email/components";
import type { JSX } from "react";
import { type CreateEmailOptions, Resend } from "resend";
import { HtmlWrapper } from "@/server/email/templates/base";
import { serverConsts, serverEnv } from "@/server/serverConsts";

const resend = new Resend(serverEnv.RESEND_API_KEY);

export const email = {
	sendWithTemplate: async (template: EmailTemplateReturn, options: { to: string }) => {
		const { preview, ...email } = template;

		// The preview length should be lesser than 90 chars. https://react.email/docs/components/preview
		if ((preview?.length ?? 0) > 90)
			console.warn(
				`The email preview <${preview}> has ${preview?.length} chars. It should be less than 90!`,
			);

		const react = <HtmlWrapper preview={preview}>{email.react}</HtmlWrapper>;

		await sendEmail({
			...email,
			react,
			/**
			 * "Including a plain text version of your email ensures that your message is accessible to all recipients,
			 * including those who have email clients that do not support HTML."
			 *
			 * We generate the text automatically using the https://react.email/docs/utilities/render#4-convert-to-plain-text.
			 *
			 * The generated text is more than good enough specially as probably no one doesn't support HTML emails.
			 */
			text: await render(react, { plainText: true }),
			to: options.to,
		});
	},
};

export type EmailTemplateReturn = {
	subject: string;
	/**
	 * The text that appears below the email subject when you haven't opened it yet.
	 *
	 * It should be kept under 90 chars!
	 * https://react.email/docs/components/preview
	 */
	preview?: string;
	react: JSX.Element;
};

type SendEmailProps = {
	to: string;
	react: React.ReactNode; // Make it required instead of optional
} & Omit<CreateEmailOptions, "from" | "to" | "react">;

const sendEmail = async ({ to, ...props }: SendEmailProps) => {
	const result = await resend.emails.send({
		...props,
		from: serverConsts.email.sender,
		to: [to],
	});

	if (result.error) throw new Error(JSON.stringify(result.error));
};
