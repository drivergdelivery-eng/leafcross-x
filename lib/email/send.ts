import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.RESEND_FROM_EMAIL ?? "orders@leafcross.com";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping send");
    return;
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) console.error("[email] send error:", error);
}
