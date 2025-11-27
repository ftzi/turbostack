import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Terms of Service",
}

/* The <Content/> can be generated using the prompt at the bottom of this file. */

export default function Page(): React.ReactElement {
	return <Content />
}

function Content(): React.ReactElement {
	return (
		<article className="prose prose-neutral dark:prose-invert mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
			<p className="lead">
				Please read these Terms of Service carefully before using our website. By accessing or using our service, you
				agree to be bound by these terms.
			</p>

			<h2>Acceptance of Terms</h2>
			<p>
				By accessing and using this website, you accept and agree to be bound by the terms and provision of this
				agreement. If you do not agree to abide by these terms, please do not use this service.
			</p>

			<h2>Use License</h2>
			<p>
				Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory
				viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
			</p>
			<ul>
				<li>Modify or copy the materials</li>
				<li>Use the materials for any commercial purpose</li>
				<li>Attempt to decompile or reverse engineer any software contained on the website</li>
				<li>Remove any copyright or other proprietary notations from the materials</li>
			</ul>

			<h2>User Accounts</h2>
			<p>
				When you create an account with us, you must provide information that is accurate, complete, and current at all
				times. You are responsible for safeguarding the password and for all activities that occur under your account.
			</p>

			<h2>Prohibited Activities</h2>
			<p>You agree not to engage in any of the following prohibited activities:</p>
			<ul>
				<li>Copying, distributing, or disclosing any part of the service</li>
				<li>Using any automated system to access the service</li>
				<li>Transmitting spam, chain letters, or other unsolicited communications</li>
				<li>Attempting to interfere with the proper working of the service</li>
			</ul>

			<h2>Disclaimer</h2>
			<p>
				The materials on our website are provided on an &quot;as is&quot; basis. We make no warranties, expressed or
				implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties
				or conditions of merchantability, fitness for a particular purpose, or non-infringement.
			</p>

			<h2>Limitations</h2>
			<p>
				In no event shall we or our suppliers be liable for any damages arising out of the use or inability to use the
				materials on our website, even if we have been notified orally or in writing of the possibility of such damage.
			</p>

			<h2>Governing Law</h2>
			<p>
				These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit
				to the exclusive jurisdiction of the courts in that location.
			</p>

			<h2>Changes to Terms</h2>
			<p>
				We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to
				access or use our service after those revisions become effective, you agree to be bound by the revised terms.
			</p>

			<h2>Contact Us</h2>
			<p>If you have any questions about these Terms, please contact us.</p>

			<p className="text-muted-foreground text-sm">Last updated: January 2025</p>
		</article>
	)
}

/*
 * Below is an AI prompt you can use to generate the Terms of Service.
 *
 * I suggest using DeepSeek with the DeepThink option, which is free as has great results.
 *
 * Change the **Project-Specific Details** section as you need.
 *
 * Cautiously check the generated policy. Consider checking it with a lawyer to ensure compliance with applicable laws and regulations.
 */

/*
Create a clear, legally protective Terms of Service for digital products/SaaS that balances compliance with readability.

---

### **Project-Specific Details**
- **Product Name**: [Example]
- **Contact Email**: [contact@example.com]
- **Service Type**: [SaaS]
- **Refund Policy**: [All digital product sales are final unless mandatory by local consumer laws.]
- **Relevant Pages Where User Must Agree to Use**:
  - `/privacy` (Privacy Policy)
- **Key Features**:
  - Authentication: [None/Email/Google/GitHub]
  - Payments: [Stripe/Polar]
  - User Content: [None/Uploads/Posts]

---

### **Core Requirements**
1. **Service Basics**
   - Clear description of core functionality
   - Minimum age requirement (16+ default)
   - **Mandatory Agreements Clause**:
     *"By using [Product Name], you confirm acceptance of all policies listed in our Terms."*

2. **User Rules**
   - Prohibited activities (reverse engineering, spam, resale)
   - Account security obligations

3. **Payments**
   - Non-refundable policy per chosen Refund Policy
   - Subscription/cancellation details if applicable

4. **Liability**
   - "As-is" service disclaimer
   - Consequential damage exclusion

5. **Termination**
   - Conditions for service suspension
   - Account deletion process

6. **Updates**
   - Modification notification method
   - Continued use = acceptance

---

### **Optional Add-ons**
*(Include If Applicable)*
- Dispute resolution framework
- User content ownership terms
- Third-party service liabilities

---

### **Technical Requirements**
- Output as React component named "Content"
- Use only: `<section>`, `<h2>`, `<p>`, `<ul>`, `<li>`
- No classes/styles
- Bold critical terms with `<strong>`

---

### **Compliance Foundation**
Must address:
- GDPR (EU)
- CCPA (California)
- Global e-commerce standards
- Other relevant regional laws

*/
