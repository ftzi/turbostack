import { Body, Button, Container, Head, Html, Link, Preview, Section, Text, Tailwind } from "@react-email/components";

type MagicLinkEmailProps = {
	token: string;
	magicLink: string;
	appName: string;
	appUrl: string;
};

export const MagicLinkEmail = ({ token, magicLink, appName, appUrl }: MagicLinkEmailProps) => (
	<Html lang="en" dir="ltr">
		<Head />
		<Preview>
			Log in to {appName} with this code: {token}
		</Preview>
		<Tailwind>
			<Body className="bg-gray-50 font-sans">
				<Container className="mx-auto bg-white py-5 pb-12 mb-16">
					<Section className="px-12">
						<Text className="text-[#1d1c1d] text-3xl font-bold mt-7 mb-0">Login to {appName}</Text>
						<Text className="text-black text-lg leading-7 mt-8 mb-6">
							We received a request to log in to our services. You can use either the following code or link:
						</Text>
						<Text className="py-2.5 px-4 rounded-lg text-xl font-semibold bg-gray-100 text-center my-0 border border-gray-200 text-black">
							{token}
						</Text>
						<Button
							href={magicLink}
							className="mt-3.5 mb-0 w-full box-border py-3 px-4 font-semibold rounded-lg text-center bg-black text-white no-underline inline-block"
						>
							Sign In with Magic Link
						</Button>
						<Text className="mt-5 mb-0 text-[#444] text-sm">
							If you did not request access to our services, you can safely ignore this email.
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

MagicLinkEmail.PreviewProps = {
	token: "ABC-123-DEF-456",
	magicLink: "https://example.com/auth/verify?token=abc123",
	appName: "MyProject",
	appUrl: "https://example.com",
} as MagicLinkEmailProps;

export default MagicLinkEmail;
