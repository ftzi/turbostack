import type { EmailTemplateReturn } from "@/server/email/email";
import {
  EmailTemplateContainer,
  emailStyles,
} from "@/server/email/templates/base";
import { Button, Text } from "@react-email/components";

/** By default NextStack doesn't support email & password login. If you add it, you can use this template for password resetting. */
export const emailTemplateResetPassword = (props: {
  resetLink: string;
}): EmailTemplateReturn => ({
  subject: "Reset your password",
  preview: "A password reset has been requested",
  react: (
    <EmailTemplateContainer>
      <Text style={emailStyles.h1}>Password Reset</Text>
      <Text style={emailStyles.heroText}>
        We received a request to reset your password. You can use the following
        link to reset it:
      </Text>
      <Button href={props.resetLink} style={emailStyles.mainButton}>
        Reset Password
      </Button>
      <Text style={emailStyles.afterButtonText}>
        If you did not request a password reset, you can safely ignore this
        email.
      </Text>
    </EmailTemplateContainer>
  ),
});
