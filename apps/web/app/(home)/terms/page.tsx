import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service",
};

/* The <Content/> can be generated using the prompt at the bottom of this file. */

export default function Page(): React.ReactElement {
	return <Content />;
}

const Content = (): React.ReactElement => <h2>TBD</h2>;

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
