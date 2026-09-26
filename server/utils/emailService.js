import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.FROM_EMAIL || "Ify's Signature <onboarding@resend.dev>";

export const sendCustomerOrderEmail = async ({
  customerEmail,
  customerName,
  orderId,
  amount,
  currency,
  items,
}) => {
  if (!customerEmail) {
    console.log("No customer email provided. Skipping customer email.");
    return;
  }

  const formattedAmount = `${currency.toUpperCase()} ${(
    amount / 100
  ).toFixed(2)}`;

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d6;">
            <strong>${item.name}</strong>
            ${
              item.description
                ? `<div style="color: #777; font-size: 13px; margin-top: 4px;">
                    ${item.description}
                  </div>`
                : ""
            }
          </td>

          <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d6; text-align: right;">
            ${item.quantity}
          </td>

          <td style="padding: 12px 0; border-bottom: 1px solid #e5e0d6; text-align: right;">
            $${(item.amount / 100).toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [customerEmail],
    subject: "Your Ify's Signature order is confirmed 🎉",
    html: `
      <div style="
        margin: 0;
        padding: 40px 20px;
        background: #f5f0e8;
        font-family: Arial, Helvetica, sans-serif;
        color: #1a1a1a;
      ">
        <div style="
          max-width: 620px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
        ">
          <div style="
            padding: 32px;
            background: #1a2e1a;
            color: #ffffff;
            text-align: center;
          ">
            <h1 style="
              margin: 0;
              font-size: 28px;
            ">
              Ify's Signature
            </h1>

            <p style="
              margin: 8px 0 0;
              color: #f0d98c;
              font-size: 15px;
            ">
              Fresh. Flavorful. Signature.
            </p>
          </div>

          <div style="padding: 36px 32px;">
            <h2 style="
              margin-top: 0;
              color: #1a2e1a;
            ">
              Order Confirmed! 🎉
            </h2>

            <p>
              Hi ${customerName || "there"},
            </p>

            <p>
              Thank you for ordering from Ify's Signature.
              We've successfully received your payment and your order
              is now confirmed.
            </p>

            <div style="
              margin: 24px 0;
              padding: 18px;
              background: #f5f0e8;
              border-radius: 10px;
            ">
              <strong>Order ID</strong>
              <div style="
                margin-top: 6px;
                color: #666;
                word-break: break-all;
              ">
                ${orderId}
              </div>
            </div>

            <h3 style="color: #1a2e1a;">
              Order Summary
            </h3>

            <table style="
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            ">
              <thead>
                <tr>
                  <th style="
                    text-align: left;
                    padding-bottom: 12px;
                  ">
                    Item
                  </th>

                  <th style="
                    text-align: right;
                    padding-bottom: 12px;
                  ">
                    Qty
                  </th>

                  <th style="
                    text-align: right;
                    padding-bottom: 12px;
                  ">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="
              margin-top: 24px;
              padding-top: 20px;
              border-top: 2px solid #d4a843;
              text-align: right;
              font-size: 20px;
              font-weight: bold;
              color: #1a2e1a;
            ">
              Total: ${formattedAmount}
            </div>

            <p style="
              margin-top: 30px;
              line-height: 1.7;
            ">
              We'll be in touch with you regarding your order.
              Thank you for choosing Ify's Signature!
            </p>

            <p style="
              margin-top: 30px;
              color: #6b6b6b;
              font-size: 13px;
            ">
              This is an automated confirmation of your successful payment.
            </p>
          </div>

          <div style="
            padding: 24px 32px;
            background: #1a2e1a;
            color: #ffffff;
            text-align: center;
            font-size: 13px;
          ">
            © ${new Date().getFullYear()} Ify's Signature
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("CUSTOMER EMAIL ERROR:", error);
    throw error;
  }

  console.log(
    `Customer confirmation email sent: ${data?.id || "unknown"}`
  );

  return data;
};

export const sendBusinessOrderEmail = async ({
  customerEmail,
  customerName,
  customerPhone,
  orderId,
  amount,
  currency,
  items,
}) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.log("ADMIN_EMAIL is not configured. Skipping business email.");
    return;
  }

  const formattedAmount = `${currency.toUpperCase()} ${(
    amount / 100
  ).toFixed(2)}`;

  const itemsHtml = items
    .map(
      (item) => `
        <li style="margin-bottom: 12px;">
          <strong>${item.name}</strong>
          ${
            item.description
              ? `<div style="color: #666; font-size: 13px;">
                  ${item.description}
                </div>`
              : ""
          }
          <div>
            Quantity: ${item.quantity}
          </div>
        </li>
      `
    )
    .join("");

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [adminEmail],
    subject: `New Ify's Signature order — ${formattedAmount}`,
    html: `
      <div style="
        margin: 0;
        padding: 40px 20px;
        background: #f5f0e8;
        font-family: Arial, Helvetica, sans-serif;
        color: #1a1a1a;
      ">
        <div style="
          max-width: 620px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
        ">
          <div style="
            padding: 28px;
            background: #1a2e1a;
            color: #ffffff;
          ">
            <h1 style="margin: 0;">
              New Order Received 🎉
            </h1>
          </div>

          <div style="padding: 32px;">
            <h2 style="color: #1a2e1a;">
              Customer Information
            </h2>

            <p>
              <strong>Name:</strong>
              ${customerName || "Not provided"}
            </p>

            <p>
              <strong>Email:</strong>
              ${customerEmail || "Not provided"}
            </p>

            <p>
              <strong>Phone:</strong>
              ${customerPhone || "Not provided"}
            </p>

            <p>
              <strong>Order ID:</strong>
              ${orderId}
            </p>

            <h2 style="
              margin-top: 30px;
              color: #1a2e1a;
            ">
              Order
            </h2>

            <ul style="
              padding-left: 20px;
              line-height: 1.7;
            ">
              ${itemsHtml}
            </ul>

            <div style="
              margin-top: 24px;
              padding: 20px;
              background: #f5f0e8;
              border-radius: 10px;
              font-size: 20px;
              font-weight: bold;
            ">
              Total Paid: ${formattedAmount}
            </div>

            <div style="
              margin-top: 24px;
              padding: 14px;
              background: #eaf4e5;
              border-radius: 8px;
              color: #1a2e1a;
              font-weight: bold;
            ">
              Payment Status: PAID
            </div>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("BUSINESS EMAIL ERROR:", error);
    throw error;
  }

  console.log(
    `Business order email sent: ${data?.id || "unknown"}`
  );

  return data;
};