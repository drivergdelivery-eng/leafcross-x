import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { Resend } from "resend";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, partner_type, message, product } = await req.json();

    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // ── 1. Save to Supabase ──────────────────────────────────────────────
    const supabase = adminClient();
    const { error: dbError } = await supabase.from("contact_queries").insert({
      name,
      email,
      partner_type: partner_type || null,
      message: product ? `[Product Inquiry: ${product}]\n\n${message}` : message,
    });

    // Table may not exist yet — don't block the user, just log it
    if (dbError) {
      console.warn("contact_queries insert failed:", dbError.message);
    }

    // ── 2. Send email notification to Leaf Cross ─────────────────────────
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const subjectLine = product
        ? `Product Inquiry — ${product} — from ${name}`
        : `New ${partner_type ? partner_type + " " : ""}inquiry from ${name}`;

      // Notification to Leaf Cross
      await resend.emails.send({
        from:     "Leaf Cross Website <noreply@leafcross.com>",
        to:       ["info@leafcross.com"],
        replyTo:  email,
        subject:  subjectLine,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#000;padding:24px 28px">
              <p style="margin:0;color:#00f6ff;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">Leaf Cross Biomedical</p>
              <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:800">New Inquiry Received</h1>
            </div>
            <div style="background:#f9f9f9;padding:28px">
              <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
                <tr><td style="padding:8px 0;color:#666;font-size:13px;width:120px">Name</td><td style="padding:8px 0;font-size:14px;font-weight:600">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#666;font-size:13px">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#0070f3">${email}</a></td></tr>
                ${partner_type ? `<tr><td style="padding:8px 0;color:#666;font-size:13px">Type</td><td style="padding:8px 0;font-size:14px;text-transform:capitalize">${partner_type}</td></tr>` : ""}
                ${product ? `<tr><td style="padding:8px 0;color:#666;font-size:13px">Product</td><td style="padding:8px 0;font-size:14px;font-weight:600">${product}</td></tr>` : ""}
              </table>
              <div style="background:#fff;border:1px solid #e5e5e5;border-radius:6px;padding:16px 18px">
                <p style="margin:0 0 6px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.08em">Message</p>
                <p style="margin:0;font-size:14px;line-height:1.65;color:#333">${message.replace(/\n/g, "<br>")}</p>
              </div>
              <div style="margin-top:20px">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subjectLine)}" style="display:inline-block;padding:10px 22px;background:#000;color:#fff;font-size:13px;font-weight:700;text-decoration:none;border-radius:6px">Reply to ${name}</a>
              </div>
            </div>
            <div style="padding:16px 28px;background:#f0f0f0;font-size:12px;color:#999;text-align:center">
              Leaf Cross Biomedical · Nelson, BC · Health Canada Licensed Cannabis Processor
            </div>
          </div>`,
      }).catch(err => console.warn("Notification email failed:", err));

      // Confirmation to the sender
      await resend.emails.send({
        from:    "Leaf Cross Biomedical <noreply@leafcross.com>",
        to:      [email],
        subject: "We received your inquiry — Leaf Cross Biomedical",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#000;padding:24px 28px">
              <p style="margin:0;color:#00f6ff;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">Leaf Cross Biomedical</p>
              <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:800">Message Received</h1>
            </div>
            <div style="background:#f9f9f9;padding:28px">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#333">Hi <strong>${name}</strong>,</p>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#555">Thank you for reaching out to Leaf Cross Biomedical. We have received your message and will get back to you at <strong>${email}</strong> shortly.</p>
              ${product ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#555">You inquired about: <strong>${product}</strong></p>` : ""}
              <div style="background:#fff;border:1px solid #e5e5e5;border-left:3px solid #00b8c8;border-radius:4px;padding:14px 16px;margin:20px 0">
                <p style="margin:0 0 6px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.08em">Your message</p>
                <p style="margin:0;font-size:13px;color:#666;line-height:1.6">${message.replace(/\n/g, "<br>")}</p>
              </div>
              <p style="margin:20px 0 0;font-size:13px;color:#888">If you have a follow-up question, reply to this email or contact us directly at <a href="mailto:info@leafcross.com" style="color:#0070f3">info@leafcross.com</a>.</p>
            </div>
            <div style="padding:16px 28px;background:#f0f0f0;font-size:12px;color:#999;text-align:center">
              Leaf Cross Biomedical · Nelson, BC · Health Canada Licensed Cannabis Processor
            </div>
          </div>`,
      }).catch(err => console.warn("Confirmation email failed:", err));
    } else {
      console.warn("RESEND_API_KEY not set — email notifications skipped.");
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
