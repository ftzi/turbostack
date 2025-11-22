import { Body, Button, Container, Head, Html, Link, Preview, Section, Text, Tailwind } from "@react-email/components";

type ResetPasswordEmailProps = {
	resetLink: string;
	appName: string;
	appUrl: string;
};

export const ResetPasswordEmail = ({ resetLink, appName, appUrl }: ResetPasswordEmailProps) => (
	<Html lang="en" dir="ltr">
		<Head />
		<Preview>Reset your {appName} password</Preview>
		<Tailwind>
			<Body className="bg-gray-50 font-sans">
				<Container className="mx-auto bg-white py-5 pb-12 mb-16">
					<Section className="px-12">
						<Text className="text-[#1d1c1d] text-3xl font-bold mt-7 mb-0">Password Reset</Text>
						<Text className="text-black text-lg leading-7 mt-8 mb-6">
							We received a request to reset your password. You can use the following link to reset it:
						</Text>
						<Button
							href={resetLink}
							className="mt-3.5 mb-0 w-full box-border py-3 px-4 font-semibold rounded-lg text-center bg-black text-white no-underline inline-block"
						>
							Reset Password
						</Button>
						<Text className="mt-5 mb-0 text-[#444] text-sm">
							If you did not request a password reset, you can safely ignore this email.
						</Text>
						<Section className="mx-auto mt-8">
							<Text className="mt-3 text-xs text-[#b7b7b7] mx-auto text-center mb-0">
								© {new Date().getFullYear()}{" "}
								<Link href={appUrl} className="text-inherit underline">
									{appName}
								</Link>
								. All Rights Reserved.
							</Text>
						</Section>
						<span className="hidden">noCollapse-{Date.now()}</span>
					</Section>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

ResetPasswordEmail.PreviewProps = {
	resetLink: "https://example.com/auth/reset-password?token=abc123",
	appName: "MyProject",
	appUrl: "https://example.com",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;
