import EmailTemplate from "@/components/auth/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(link: string, email: string) {
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

  console.log("✅ Email sent:", data);
  return data;
}