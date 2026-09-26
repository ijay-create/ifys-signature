import dotenv from "dotenv";
import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.FROM_EMAIL || "Ify's Signature <onboarding@resend.dev>";
const adminEmail = process.env.ADMIN_EMAIL;

console.log("========================================");
console.log("IFY'S SIGNATURE - RESEND EMAIL TEST");
console.log("========================================");

console.log("RESEND API KEY:", resendApiKey ? "Loaded ✅" : "Missing ❌");
console.log("FROM EMAIL:", fromEmail);
console.log("ADMIN EMAIL:", adminEmail || "Missing ❌");
console.log("");

if (!resendApiKey) {
  console.error("❌ RESEND_API_KEY is missing from the root .env file.");
  process.exit(1);
}

if (!adminEmail) {
  console.error("❌ ADMIN_EMAIL is missing from the root .env file.");
  process.exit(1);
}

const resend = new Resend(resendApiKey);

const sendTestEmail = async () => {
  try {
    console.log("Sending test email...");
    console.log("");

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: "Ify's Signature — Resend Test Email",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#f7f3ec;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:40px auto;background:#ffffff;padding:40px;border-radius:12px;">
              <h1 style="margin:0 0 20px;color:#222;">
                Resend Test Successful 🎉
              </h1>

              <p style="font-size:16px;line-height:1.6;color:#444;">
                This is a test email from Ify's Signature.
              </p>

              <p style="font-size:16px;line-height:1.6;color:#444;">
                If you received this email, the Resend API,
                sender address, and admin recipient are working correctly.
              </p>

              <hr style="border:0;border-top:1px solid #eee;margin:30px 0;" />

              <p style="font-size:14px;color:#777;">
                From: ${fromEmail}
              </p>

              <p style="font-size:14px;color:#777;">
                To: ${adminEmail}
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ RESEND ERROR:");
      console.error(error);
      process.exit(1);
    }

    console.log("========================================");
    console.log("✅ EMAIL SENT SUCCESSFULLY!");
    console.log("========================================");
    console.log("");
    console.log("Resend response:");
    console.log(data);
    console.log("");
    console.log(`📧 Check ${adminEmail} for the test email.`);
  } catch (error) {
    console.error("========================================");
    console.error("❌ EMAIL TEST FAILED");
    console.error("========================================");
    console.error(error);
    process.exit(1);
  }
};

sendTestEmail();