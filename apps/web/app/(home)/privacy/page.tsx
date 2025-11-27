import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Privacy Policy",
}

/* The <Content/> can be generated using the prompt at the bottom of this file. */

export default function Page(): React.ReactElement {
	return <Content />
}

function Content(): React.ReactElement {
	return (
		<article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
			<p className="lead">
				Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your
				information when you visit our website.
			</p>

			<h2>Information We Collect</h2>
			<p>
				We may collect information about you in a variety of ways. The information we may collect via the website
				includes:
			</p>
			<ul>
				<li>
					<strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that
					you voluntarily give to us when you register or when you choose to participate in various activities.
				</li>
				<li>
					<strong>Derivative Data:</strong> Information our servers automatically collect when you access the website,
					such as your IP address, browser type, and operating system.
				</li>
			</ul>

			<h2>Use of Your Information</h2>
			<p>
				Having accurate information about you permits us to provide you with a smooth, efficient, and customized
				experience. Specifically, we may use information collected about you to:
			</p>
			<ul>
				<li>Create and manage your account</li>
				<li>Process transactions and send related information</li>
				<li>Send you administrative information</li>
				<li>Respond to your comments and questions</li>
			</ul>

			<h2>Disclosure of Your Information</h2>
			<p>
				We may share information we have collected about you in certain situations. Your information may be disclosed as
				follows:
			</p>
			<ul>
				<li>
					<strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary
					to respond to legal process or to protect our rights.
				</li>
				<li>
					<strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform
					services for us.
				</li>
			</ul>

			<h2>Security of Your Information</h2>
			<p>
				We use administrative, technical, and physical security measures to help protect your personal information.
				While we have taken reasonable steps to secure the personal information you provide to us, please be aware that
				no security measures are perfect.
			</p>

			<h2>Contact Us</h2>
			<p>If you have questions or comments about this Privacy Policy, please contact us.</p>

			<p className="text-muted-foreground text-sm">Last updated: January 2025</p>
		</article>
	)
}

/*
 * Below is an AI prompt you can use to generate the Privacy Policy.
 *
 * I suggest using DeepSeek with the DeepThink option, which is free as has great results.
 *
 * Change the **Project-Specific Details** section as you need.
 *
 * Cautiously check the generated policy. Consider checking it with a lawyer to ensure compliance with applicable laws and regulations.
 */

/*

I am developing a website and need a privacy policy that is concise, clear, and compliant with international privacy laws, including:
- General Data Protection Regulation (GDPR) for users in the European Union.
- California Consumer Privacy Act (CCPA) for users in California, USA.
- Children's Online Privacy Protection Act (COPPA) if applicable.
- Personal Information Protection and Electronic Documents Act (PIPEDA) for users in Canada.
- Any other relevant global privacy laws.

### Project-Specific Details
Please include the following:
- Project Name: Example.
- Contact Email: contact@example.com.
- Nature of the Website: [e.g., "e-commerce services," "a SaaS product," "blogging features"].
- Technologies and Services Used:
  - Payment processors: Polar.sh.
  - Analytics: Umami, a privacy-focused, GDPR- and CCPA-compliant tool that does not use cookies or collect personal data. Analytics data is anonymized and cannot be opted out of.
  - Hosting and database: Next.js, Vercel, and neon.tech.
- User Interaction: Users can register and access accounts, purchase products, submit forms, upload content.
- Authentication: Users can log in using a magic link or third-party services (e.g., Google).
- Additional Features: The website may include [e.g., "community forums," "social media logins," "third-party integrations"].
- Geographic Scope: The default is a global audience unless otherwise specified.

### Privacy Policy Content
The privacy policy should:
1. Open with a commitment to respecting user privacy and collecting personal information only when necessary for providing services.
2. Clearly explain:
   - What personal information is collected (e.g., name, email, payment information).
   - How and why the information is collected (e.g., forms, third-party logins, analytics).
   - State that analytics data is anonymized and does not identify users, and that opting out is not necessary.
3. Specify third-party integrations (e.g., Google login, payment processors) and what data is retrieved or shared.
4. Outline data retention policies with a default as follows:
   - Default Retention Policy: User data is retained only as long as necessary to provide the requested services or fulfill legal and contractual obligations. Account-related data is retained while the account is active or as required by law. Non-account-specific data (e.g., logs or analytics) is retained for operational purposes and securely deleted or anonymized within a reasonable timeframe.
5. Describe the security practices in place to protect data from unauthorized access, misuse, or modification. Include a protocol for notifying users in case of a data breach.
6. Confirm that personal data will not be shared publicly or with third parties unless required by law or necessary for service delivery.
7. Address compliance with laws like GDPR, explaining roles as a data controller and processor in plain language.
8. Add a disclaimer for external links, clarifying that the website is not responsible for the privacy practices of third-party sites.
9. Emphasize that users can refuse to provide personal information, understanding that some features or services may be restricted.
10. Conclude by stating that continued use of the website indicates acceptance of the privacy practices and provide clear contact details for user questions.
11. Include the effective date of the policy.

### Style and Structure
The policy must:
- Be a simple JSX React component named "Content" with simple HTML elements (such as <h2>, <ul>, etc). Add no styles to them. Don't add a main title like "Privacy Policy," as we already have it somewhere else.

### Extra Considerations
- Describe safeguards for international data transfers (e.g., EU to the U.S.).
- Ensure the policy is adaptable for future website features or integrations.

### Clarification and Questions
Before generating the privacy policy, ask clarifying questions or request additional details about any missing or ambiguous information. Ensure that:
1. All necessary technologies, tools, or services are listed.
2. Specific data collection, usage, or retention policies are clear.
3. Geographic or jurisdiction-specific details are well-defined.

*/
