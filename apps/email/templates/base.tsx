import { consts, env } from "@/lib/consts";
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// The sent emails have no access to Mantine theme provider, so we manually provide some values to keep in sync with the app UI.
const borderRadius =
  finalTheme.radius[finalTheme.defaultRadius as keyof MantineRadiusValues] ??
  "8px";

const Copyright = () => (
  <Section style={{ margin: "0 auto", marginTop: "8px" }}>
    <Text
      style={{
        ...emailStyles.text,
        marginTop: "12px",
        fontSize: "12px",
        color: "#b7b7b7",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      © {new Date().getFullYear()}{" "}
      <Link
        href={env.NEXT_PUBLIC_URL}
        style={{ color: "inherit", textDecoration: "underline" }}
      >
        {consts.appName}
      </Link>
      . All Rights Reserved.
    </Text>
  </Section>
);

export const EmailTemplateContainer = ({
  children,
}: { children: React.ReactNode }) => (
  <div
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#f4f4f4",
      fontFamily:
        '"Google Sans", Roboto, RobotoDraft, Helvetica, Arial, sans-serif',
      padding: "30px 30px",
      boxSizing: "border-box",
    }}
  >
    <Container
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius,
        padding: "20px 40px",
        maxWidth: "600px",
        width: "100%",
      }}
    >
      <Section>
        {children}
        <Copyright />
        <NoCollapse />
      </Section>
    </Container>
  </div>
);

/** Prevents Gmail, for example, to collapse the content if they are the same as the previous emails. */
const NoCollapse = () => (
  <span style={{ display: "none" }}>noCollapse-{Date.now()}</span>
);

/**
 * This is not included in the EmailTemplateContainer as it wouldn't allow us to render
 * it on Storybook to see the templates without requiring us to send an email.
 */
export const HtmlWrapper = ({
  children,
  preview,
}: { children: React.ReactNode; preview?: string }) => (
  <Html lang="en" dir="ltr">
    <Head />
    {preview && <Preview>{preview}</Preview>}
    <Body>{children}</Body>
  </Html>
);

export const emailStyles = {
  text: {
    color: "#000000",
    fontSize: "14px",
    marginBottom: 0,
  },
  h1: {
    color: "#1d1c1d",
    fontSize: "30px",
    fontWeight: "700",
    marginTop: "26px",
  },
  heroText: {
    color: "#000000",
    fontSize: "18px",
    lineHeight: "28px",
    marginTop: "30px",
  },
  mainButton: {
    marginTop: "14px",
    marginBottom: "0px",
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    fontWeight: 600,
    borderRadius,
    textAlign: "center",
    backgroundColor: resultingButtonColor,
    color: isLightColor(resultingButtonColor, theme.luminanceThreshold ?? 0.4)
      ? "#000000"
      : "#ffffff",
  },
  afterButtonText: {
    marginTop: "20px",
    marginBottom: "0px",
    color: "#444",
  },
} satisfies Record<string, React.CSSProperties>;
