import { Resend } from "resend";
import EmailTemplate from "@/components/auth/EmailTemplate";
import { EmailSender } from "@/core/ports/EmailSender";

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendEmailSender implements EmailSender {
  async sendVerification(link: string, email: string) {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Verify User",
      react: EmailTemplate({ link }),
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw new Error(error.message);
    }

    return data;
  }
}
