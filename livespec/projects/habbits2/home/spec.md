# Landing Page [HAB.home]

Public-facing landing page showcasing product features and value proposition.

## Entry Points

| Route | Description |
|-------|-------------|
| `/` | Main landing page |

## UI

Landing page consists of multiple sections:
- **Hero** - Main headline, value proposition, call-to-action
- **Features** - Product feature highlights with icons and descriptions
- **Testimonials** - User testimonials and social proof
- **CTA** - Final call-to-action section for signup/login

### Navigation

**Header:**
- Logo (clickable) → `/` (home)
- "Features" link → `#features` anchor
- "Testimonials" link → `#testimonials` anchor
- "Privacy" link → `/privacy` [HAB.legal]
- "Terms" link → `/terms` [HAB.legal]
- "Get Started" button → `/auth` (Better Auth)
- Theme toggle (inline)

**Footer:**
- Logo (clickable) → `/` (home)
- Product section:
  - "Features" → `#features` anchor
  - "Testimonials" → `#testimonials` anchor
  - "Get Started" → `/auth` (Better Auth)
- Legal section:
  - "Privacy Policy" → `/privacy` [HAB.legal]
  - "Terms of Service" → `/terms` [HAB.legal]
- Social links:
  - GitHub → `https://github.com` (external)
  - Twitter → `https://twitter.com` (external)

### Design Requirements

- **Mobile-responsive** - Must work on all screen sizes (375px+)
- **Navigation** - Header and footer with consistent navigation
- **Theme support** - Light and dark mode

---

## Page Structure [HAB.home.structure]

Landing page displays in correct order with all sections visible.

### Scenario: Display complete landing page [HAB.home.structure.complete]

- WHEN user visits landing page
- THEN hero section displays at top
- AND features section displays below hero
- AND testimonials section displays below features
- AND CTA section displays at bottom
- AND all sections are visible without scrolling required for above-fold content

### Scenario: Hero section content [HAB.home.structure.hero]

- WHEN user views hero section
- THEN headline communicates product value
- AND "Start Your Journey" button is prominently displayed
- AND button links to `/auth` (Better Auth sign-in)
- AND "Learn More" button links to `#features` anchor

### Scenario: Features navigation [HAB.home.structure.features-nav]

- WHEN user clicks features link in navigation
- THEN page scrolls to features section
- AND features section is brought into view

### Scenario: Testimonials navigation [HAB.home.structure.testimonials-nav]

- WHEN user clicks testimonials link in navigation
- THEN page scrolls to testimonials section
- AND testimonials section is brought into view

### Scenario: CTA section content [HAB.home.structure.cta]

- WHEN user views CTA section
- THEN "Ready to transform your life?" headline displays
- AND "Start Your Journey Free" button is displayed
- AND button links to `/auth` (Better Auth sign-in)
- AND section has accent background color

---

## Responsive Design [HAB.home.responsive]

Landing page adapts to different screen sizes.

### Scenario: Mobile layout [HAB.home.responsive.mobile]

- WHEN user views page on mobile device (< 768px)
- THEN layout adjusts to single column
- AND navigation collapses to hamburger menu
- AND content remains readable and accessible

### Scenario: Tablet layout [HAB.home.responsive.tablet]

- WHEN user views page on tablet (768px - 1280px)
- THEN layout adapts to appropriate grid
- AND content spacing adjusts for medium screens

### Scenario: Desktop layout [HAB.home.responsive.desktop]

- WHEN user views page on desktop (>= 1280px)
- THEN full multi-column layout displays
- AND content uses maximum readable width

---

## Theme Support [HAB.home.theme]

Landing page supports light and dark themes.

### Scenario: Light theme [HAB.home.theme.light]

- WHEN user has light theme active
- THEN all sections use light theme colors
- AND text contrast meets accessibility standards
- AND images/icons adapt to light theme

### Scenario: Dark theme [HAB.home.theme.dark]

- WHEN user has dark theme active
- THEN all sections use dark theme colors
- AND text contrast meets accessibility standards
- AND images/icons adapt to dark theme

### Scenario: Theme toggle [HAB.home.theme.toggle]

- WHEN user clicks theme toggle in header
- THEN theme switches between light and dark
- AND preference is saved for future visits

---

## Header Navigation [HAB.home.header]

Header provides primary navigation for landing page.

### Scenario: Get Started button [HAB.home.header.get-started]

- WHEN user clicks "Get Started" button in header
- THEN navigates to `/auth` (Better Auth)
- AND user can sign in or register

### Scenario: Features link [HAB.home.header.features]

- WHEN user clicks "Features" link
- THEN page scrolls to features section
- AND features anchor is brought into view

### Scenario: Testimonials link [HAB.home.header.testimonials]

- WHEN user clicks "Testimonials" link
- THEN page scrolls to testimonials section
- AND testimonials anchor is brought into view

### Scenario: Privacy link [HAB.home.header.privacy]

- WHEN user clicks "Privacy" link
- THEN navigates to `/privacy`
- AND privacy policy page loads

### Scenario: Terms link [HAB.home.header.terms]

- WHEN user clicks "Terms" link
- THEN navigates to `/terms`
- AND terms of service page loads

### Scenario: Logo click [HAB.home.header.logo]

- WHEN user clicks logo in header
- THEN navigates to `/` (home)
- AND page reloads or stays on home

---

## Footer Navigation [HAB.home.footer]

Footer provides secondary navigation and legal links.

### Scenario: Footer Get Started link [HAB.home.footer.get-started]

- WHEN user clicks "Get Started" in footer
- THEN navigates to `/auth` (Better Auth)
- AND user can sign in or register

### Scenario: Footer Features link [HAB.home.footer.features]

- WHEN user clicks "Features" in footer
- THEN page scrolls to features section

### Scenario: Footer Testimonials link [HAB.home.footer.testimonials]

- WHEN user clicks "Testimonials" in footer
- THEN page scrolls to testimonials section

### Scenario: Footer Privacy link [HAB.home.footer.privacy]

- WHEN user clicks "Privacy Policy" in footer
- THEN navigates to `/privacy`

### Scenario: Footer Terms link [HAB.home.footer.terms]

- WHEN user clicks "Terms of Service" in footer
- THEN navigates to `/terms`

### Scenario: Footer logo click [HAB.home.footer.logo]

- WHEN user clicks logo in footer
- THEN navigates to `/` (home)

### Scenario: Social links [HAB.home.footer.social]

- WHEN user clicks GitHub link
- THEN opens GitHub URL in new tab (external)
- WHEN user clicks Twitter link
- THEN opens Twitter URL in new tab (external)
