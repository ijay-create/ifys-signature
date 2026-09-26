import express from "express";
import { Resend } from "resend";

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.FROM_EMAIL ||
  "Ify's Signature <onboarding@resend.dev>";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

router.post("/quote", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      eventType,
      eventDate,
      guests,
      location,
      message,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !eventType ||
      !eventDate ||
      !guests
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });
    }

    if (!ADMIN_EMAIL) {
      console.error(
        "ADMIN_EMAIL is missing from the server environment."
      );

      return res.status(500).json({
        success: false,
        message:
          "The contact email service is not configured.",
      });
    }

    const formattedDate = new Date(
      `${eventDate}T00:00:00`
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const safeLocation =
      location?.trim() || "Not provided";

    const safeMessage =
      message?.trim() || "No additional details provided.";

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: `New Quote Request — ${name} — ${eventType}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <title>New Quote Request</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f0e8;
              font-family: Arial, Helvetica, sans-serif;
              color: #1a1a1a;
            "
          >
            <div
              style="
                width: 100%;
                padding: 40px 15px;
                box-sizing: border-box;
              "
            >
              <div
                style="
                  max-width: 650px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 18px;
                  overflow: hidden;
                  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.08);
                "
              >

                <!-- HEADER -->

                <div
                  style="
                    background: #1a2e1a;
                    padding: 35px 30px;
                    text-align: center;
                  "
                >
                  <div
                    style="
                      color: #d4a843;
                      font-size: 12px;
                      font-weight: 700;
                      letter-spacing: 3px;
                      margin-bottom: 10px;
                    "
                  >
                    IFY'S SIGNATURE
                  </div>

                  <h1
                    style="
                      margin: 0;
                      color: #ffffff;
                      font-size: 26px;
                      line-height: 1.3;
                    "
                  >
                    New Quote Request
                  </h1>

                  <p
                    style="
                      margin: 10px 0 0;
                      color: rgba(255, 255, 255, 0.7);
                      font-size: 14px;
                    "
                  >
                    A new catering inquiry has been submitted.
                  </p>
                </div>

                <!-- INTRO -->

                <div
                  style="
                    padding: 30px;
                    border-bottom: 1px solid #e8e2d8;
                  "
                >
                  <p
                    style="
                      margin: 0;
                      font-size: 15px;
                      line-height: 1.7;
                      color: #444444;
                    "
                  >
                    You have received a new quote request from
                    <strong>${name}</strong>.
                    Here are the event details:
                  </p>
                </div>

                <!-- CUSTOMER DETAILS -->

                <div style="padding: 30px;">
                  <h2
                    style="
                      margin: 0 0 20px;
                      color: #1a2e1a;
                      font-size: 18px;
                    "
                  >
                    Customer Details
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse: collapse;
                      font-size: 14px;
                    "
                  >
                    <tr>
                      <td
                        style="
                          padding: 11px 0;
                          color: #777777;
                          width: 40%;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        Full Name
                      </td>

                      <td
                        style="
                          padding: 11px 0;
                          color: #222222;
                          font-weight: 600;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        ${name}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          padding: 11px 0;
                          color: #777777;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        Email
                      </td>

                      <td
                        style="
                          padding: 11px 0;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        <a
                          href="mailto:${email}"
                          style="
                            color: #2d4a2d;
                            text-decoration: none;
                          "
                        >
                          ${email}
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          padding: 11px 0;
                          color: #777777;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        Phone
                      </td>

                      <td
                        style="
                          padding: 11px 0;
                          border-bottom: 1px solid #eee;
                        "
                      >
                        <a
                          href="tel:${phone}"
                          style="
                            color: #2d4a2d;
                            text-decoration: none;
                          "
                        >
                          ${phone}
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- EVENT DETAILS -->

                <div
                  style="
                    margin: 0 30px 30px;
                    padding: 25px;
                    background: #f8f5ef;
                    border-radius: 14px;
                  "
                >
                  <h2
                    style="
                      margin: 0 0 20px;
                      color: #1a2e1a;
                      font-size: 18px;
                    "
                  >
                    Event Details
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse: collapse;
                      font-size: 14px;
                    "
                  >
                    <tr>
                      <td
                        style="
                          padding: 8px 0;
                          color: #777777;
                        "
                      >
                        Event Type
                      </td>

                      <td
                        style="
                          padding: 8px 0;
                          color: #222222;
                          font-weight: 600;
                        "
                      >
                        ${eventType}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          padding: 8px 0;
                          color: #777777;
                        "
                      >
                        Event Date
                      </td>

                      <td
                        style="
                          padding: 8px 0;
                          color: #222222;
                          font-weight: 600;
                        "
                      >
                        ${formattedDate}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          padding: 8px 0;
                          color: #777777;
                        "
                      >
                        Number of Guests
                      </td>

                      <td
                        style="
                          padding: 8px 0;
                          color: #222222;
                          font-weight: 600;
                        "
                      >
                        ${guests}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="
                          padding: 8px 0;
                          color: #777777;
                        "
                      >
                        Location
                      </td>

                      <td
                        style="
                          padding: 8px 0;
                          color: #222222;
                          font-weight: 600;
                        "
                      >
                        ${safeLocation}
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- MESSAGE -->

                <div style="padding: 0 30px 30px;">
                  <h2
                    style="
                      margin: 0 0 15px;
                      color: #1a2e1a;
                      font-size: 18px;
                    "
                  >
                    Additional Details
                  </h2>

                  <div
                    style="
                      padding: 18px;
                      background: #fafafa;
                      border-left: 3px solid #d4a843;
                      border-radius: 6px;
                      color: #555555;
                      font-size: 14px;
                      line-height: 1.7;
                    "
                  >
                    ${safeMessage}
                  </div>
                </div>

                <!-- ACTION -->

                <div
                  style="
                    padding: 25px 30px;
                    background: #1a2e1a;
                    text-align: center;
                  "
                >
                  <a
                    href="mailto:${email}"
                    style="
                      display: inline-block;
                      padding: 12px 22px;
                      background: #d4a843;
                      color: #1a2e1a;
                      border-radius: 999px;
                      text-decoration: none;
                      font-size: 13px;
                      font-weight: 700;
                    "
                  >
                    Reply to ${name}
                  </a>
                </div>

              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error(
        "RESEND QUOTE EMAIL ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to send your quote request right now.",
      });
    }

    console.log(
      "QUOTE REQUEST EMAIL SENT:",
      data?.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Your quote request has been sent successfully.",
    });
  } catch (error) {
    console.error(
      "QUOTE REQUEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while sending your request.",
    });
  }
});

export default router;