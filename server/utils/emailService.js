import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.FROM_EMAIL ||
  "Ify's Signature <onboarding@resend.dev>";

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatMoney = (amount, currency = "usd") => {
  return `${currency.toUpperCase()} ${(
    Number(amount || 0) / 100
  ).toFixed(2)}`;
};

const formatDescription = (description = "") => {
  if (!description) {
    return "";
  }

  const parts = description
    .split(" • ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  return `
    <div style="
      margin-top: 12px;
      padding: 14px;
      background: #faf8f3;
      border-radius: 10px;
      border: 1px solid #eee8dc;
    ">
      ${parts
        .map((part) => {
          const separatorIndex = part.indexOf(":");

          if (separatorIndex === -1) {
            return `
              <div style="
                margin-bottom: 6px;
                color: #555;
                font-size: 13px;
                line-height: 1.6;
              ">
                ${escapeHtml(part)}
              </div>
            `;
          }

          const label = part
            .slice(0, separatorIndex)
            .trim();

          const value = part
            .slice(separatorIndex + 1)
            .trim();

          return `
            <div style="
              margin-bottom: 7px;
              font-size: 13px;
              line-height: 1.6;
            ">
              <strong style="color: #333;">
                ${escapeHtml(label)}:
              </strong>

              <span style="color: #666;">
                ${escapeHtml(value)}
              </span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
};

const createCustomerItemsHtml = (
  items,
  currency
) => {
  return items
    .map(
      (item) => `
        <tr>
          <td style="
            padding: 18px 0;
            border-bottom: 1px solid #e5e0d6;
            vertical-align: top;
          ">
            <strong style="
              color: #1a1a1a;
              font-size: 15px;
            ">
              ${escapeHtml(
                item.name ||
                  "Ify's Signature Fried Rice"
              )}
            </strong>

            ${formatDescription(item.description)}
          </td>

          <td style="
            padding: 18px 10px;
            border-bottom: 1px solid #e5e0d6;
            text-align: center;
            vertical-align: top;
            white-space: nowrap;
          ">
            ${Number(item.quantity || 1)}
          </td>

          <td style="
            padding: 18px 0;
            border-bottom: 1px solid #e5e0d6;
            text-align: right;
            vertical-align: top;
            white-space: nowrap;
            font-weight: bold;
          ">
            ${formatMoney(
              item.amount,
              currency
            )}
          </td>
        </tr>
      `
    )
    .join("");
};

const createBusinessItemsHtml = (
  items,
  currency
) => {
  return items
    .map(
      (item) => `
        <div style="
          margin-bottom: 18px;
          padding: 18px;
          background: #ffffff;
          border: 1px solid #e5e0d6;
          border-radius: 12px;
        ">
          <div style="
            font-size: 17px;
            font-weight: bold;
            color: #1a1a1a;
          ">
            ${escapeHtml(
              item.name ||
                "Ify's Signature Fried Rice"
            )}
          </div>

          ${formatDescription(item.description)}

          <div style="
            margin-top: 14px;
            display: table;
            width: 100%;
          ">
            <div style="
              display: table-row;
            ">
              <span style="
                display: table-cell;
                color: #666;
                padding: 4px 0;
              ">
                Quantity
              </span>

              <strong style="
                display: table-cell;
                text-align: right;
                padding: 4px 0;
              ">
                ${Number(item.quantity || 1)}
              </strong>
            </div>

            <div style="
              display: table-row;
            ">
              <span style="
                display: table-cell;
                color: #666;
                padding: 4px 0;
              ">
                Amount
              </span>

              <strong style="
                display: table-cell;
                text-align: right;
                padding: 4px 0;
              ">
                ${formatMoney(
                  item.amount,
                  currency
                )}
              </strong>
            </div>
          </div>
        </div>
      `
    )
    .join("");
};

export const sendCustomerOrderEmail = async ({
  customerEmail,
  customerName,
  orderId,
  amount,
  currency,
  items,
}) => {
  if (!customerEmail) {
    console.log(
      "No customer email provided. Skipping customer email."
    );

    return;
  }

  const formattedAmount = formatMoney(
    amount,
    currency
  );

  const safeCustomerName = escapeHtml(
    customerName || "there"
  );

  const safeOrderId = escapeHtml(
    orderId || "Not available"
  );

  const itemsHtml = createCustomerItemsHtml(
    items,
    currency
  );

  const { data, error } =
    await resend.emails.send({
      from: FROM_EMAIL,

      to: [customerEmail],

      subject:
        "Your Ify's Signature order is confirmed 🎉",

      html: `
        <div style="
          margin: 0;
          padding: 40px 20px;
          background: #f5f0e8;
          font-family: Arial, Helvetica, sans-serif;
          color: #1a1a1a;
        ">
          <div style="
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
          ">

            <!-- HEADER -->

            <div style="
              padding: 34px 28px;
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

            <!-- CONTENT -->

            <div style="
              padding: 36px 30px;
            ">

              <h2 style="
                margin: 0 0 18px;
                color: #1a2e1a;
                font-size: 24px;
              ">
                Order Confirmed! 🎉
              </h2>

              <p style="
                font-size: 15px;
                line-height: 1.7;
              ">
                Hi ${safeCustomerName},
              </p>

              <p style="
                font-size: 15px;
                line-height: 1.7;
                color: #555;
              ">
                Thank you for ordering from Ify's Signature.
                We've successfully received your payment and
                your order is now confirmed.
              </p>

              <!-- ORDER ID -->

              <div style="
                margin: 24px 0;
                padding: 18px;
                background: #f5f0e8;
                border-radius: 10px;
              ">
                <div style="
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  color: #777;
                ">
                  Order ID
                </div>

                <div style="
                  margin-top: 7px;
                  color: #333;
                  font-size: 13px;
                  word-break: break-all;
                ">
                  ${safeOrderId}
                </div>
              </div>

              <!-- ORDER SUMMARY -->

              <h3 style="
                margin-top: 30px;
                color: #1a2e1a;
                font-size: 19px;
              ">
                Your Order
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
                      padding: 10px 0;
                      border-bottom: 2px solid #d4a843;
                    ">
                      Item
                    </th>

                    <th style="
                      text-align: center;
                      padding: 10px;
                      border-bottom: 2px solid #d4a843;
                    ">
                      Qty
                    </th>

                    <th style="
                      text-align: right;
                      padding: 10px 0;
                      border-bottom: 2px solid #d4a843;
                    ">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- TOTAL -->

              <div style="
                margin-top: 24px;
                padding: 20px;
                background: #f5f0e8;
                border-radius: 10px;
                text-align: right;
              ">
                <span style="
                  color: #666;
                  font-size: 14px;
                ">
                  Total Paid
                </span>

                <div style="
                  margin-top: 5px;
                  color: #1a2e1a;
                  font-size: 24px;
                  font-weight: bold;
                ">
                  ${escapeHtml(formattedAmount)}
                </div>
              </div>

              <p style="
                margin-top: 30px;
                line-height: 1.7;
                color: #555;
              ">
                We'll be in touch with you regarding your order.
                Thank you for choosing Ify's Signature!
              </p>

              <p style="
                margin-top: 26px;
                color: #777;
                font-size: 13px;
                line-height: 1.6;
              ">
                This is an automated confirmation of your
                successful payment.
              </p>
            </div>

            <!-- FOOTER -->

            <div style="
              padding: 24px 30px;
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
    console.error(
      "CUSTOMER EMAIL ERROR:",
      error
    );

    throw error;
  }

  console.log(
    `Customer confirmation email sent: ${
      data?.id || "unknown"
    }`
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
  const adminEmail =
    process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.log(
      "ADMIN_EMAIL is not configured. Skipping business email."
    );

    return;
  }

  const formattedAmount = formatMoney(
    amount,
    currency
  );

  const safeCustomerName = escapeHtml(
    customerName || "Not provided"
  );

  const safeCustomerEmail = escapeHtml(
    customerEmail || "Not provided"
  );

  const safeCustomerPhone = escapeHtml(
    customerPhone || "Not provided"
  );

  const safeOrderId = escapeHtml(
    orderId || "Not available"
  );

  const itemsHtml = createBusinessItemsHtml(
    items,
    currency
  );

  const { data, error } =
    await resend.emails.send({
      from: FROM_EMAIL,

      to: [adminEmail],

      subject:
        `New Ify's Signature order — ${formattedAmount}`,

      html: `
        <div style="
          margin: 0;
          padding: 40px 20px;
          background: #f5f0e8;
          font-family: Arial, Helvetica, sans-serif;
          color: #1a1a1a;
        ">
          <div style="
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
          ">

            <!-- HEADER -->

            <div style="
              padding: 30px;
              background: #1a2e1a;
              color: #ffffff;
            ">
              <h1 style="
                margin: 0;
                font-size: 25px;
              ">
                New Order Received 🎉
              </h1>

              <p style="
                margin: 8px 0 0;
                color: #f0d98c;
              ">
                A new payment has been successfully completed.
              </p>
            </div>

            <div style="
              padding: 32px 30px;
            ">

              <!-- CUSTOMER -->

              <h2 style="
                margin-top: 0;
                color: #1a2e1a;
              ">
                Customer Information
              </h2>

              <div style="
                padding: 18px;
                background: #faf8f3;
                border-radius: 10px;
                border: 1px solid #eee8dc;
              ">

                <p style="
                  margin: 0 0 10px;
                ">
                  <strong>Name:</strong>
                  ${safeCustomerName}
                </p>

                <p style="
                  margin: 0 0 10px;
                ">
                  <strong>Email:</strong>
                  ${safeCustomerEmail}
                </p>

                <p style="
                  margin: 0 0 10px;
                ">
                  <strong>Phone:</strong>
                  ${safeCustomerPhone}
                </p>

                <p style="
                  margin: 0;
                ">
                  <strong>Order ID:</strong>
                  <span style="
                    word-break: break-all;
                  ">
                    ${safeOrderId}
                  </span>
                </p>

              </div>

              <!-- ORDER -->

              <h2 style="
                margin-top: 30px;
                color: #1a2e1a;
              ">
                Order Details
              </h2>

              ${itemsHtml}

              <!-- TOTAL -->

              <div style="
                margin-top: 24px;
                padding: 20px;
                background: #f5f0e8;
                border-radius: 10px;
              ">
                <div style="
                  color: #666;
                  font-size: 13px;
                ">
                  Total Paid
                </div>

                <div style="
                  margin-top: 5px;
                  color: #1a2e1a;
                  font-size: 25px;
                  font-weight: bold;
                ">
                  ${escapeHtml(formattedAmount)}
                </div>
              </div>

              <!-- PAYMENT STATUS -->

              <div style="
                margin-top: 20px;
                padding: 15px;
                background: #eaf4e5;
                border-radius: 8px;
                color: #1a2e1a;
                font-weight: bold;
                text-align: center;
              ">
                Payment Status: PAID
              </div>

            </div>
          </div>
        </div>
      `,
    });

  if (error) {
    console.error(
      "BUSINESS EMAIL ERROR:",
      error
    );

    throw error;
  }

  console.log(
    `Business order email sent: ${
      data?.id || "unknown"
    }`
  );

  return data;
};