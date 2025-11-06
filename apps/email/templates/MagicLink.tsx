import { consts } from "@/lib/consts";
import type { EmailTemplateReturn } from "@/server/email/email";
import {
  EmailTemplateContainer,
  emailStyles,
} from "@/server/email/templates/base";
import { Button, Text } from "@react-email/components";

export const emailTemplateMagicLink = (props: {
  token: string;
  magicLink: string;
}): EmailTemplateReturn => ({
  subject: "Your temporary login code",
  preview: `Log in to ${consts.appName} with this code: ${props.token}`,
  react: (
    <EmailTemplateContainer>
      <Text style={emailStyles.h1}>Login to {consts.appName}</Text>
      <Text style={emailStyles.heroText}>
        We received a request to log in to our services. You can use either the
        following code or link:
      </Text>
      <Text
        style={{
          ...emailStyles.text,
          padding: "10px 18px",
          borderRadius: "8px",
          fontSize: "20px",
          fontWeight: "600",
          backgroundColor: "#f4f4f4",
          textAlign: "center",
          marginBottom: "0px",
        }}
      >
        {props.token}
      </Text>
      <Button href={props.magicLink} style={emailStyles.mainButton}>
        Sign In with Magic Link
      </Button>

      <Text style={emailStyles.afterButtonText}>
        If you did not request access to our services, you can safely ignore
        this email.
      </Text>
    </EmailTemplateContainer>
  ),
});
