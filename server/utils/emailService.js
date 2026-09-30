import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const FROM_EMAIL =
  process.env.FROM_EMAIL ||
  "Ify's Signature <onboarding@resend.dev>";

/* =========================================================
   SHARED HELPERS
========================================================= */

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (
          typeof item === "string"
        ) {
          return item.trim();
        }

        if (
          item &&
          typeof item === "object"
        ) {
          return Object.entries(item)
            .map(
              ([key, itemValue]) =>
                `${key}: ${itemValue}`
            )
            .join(" — ");
        }

        return String(
          item || ""
        ).trim();
      })
      .filter(Boolean);
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return [value.trim()];
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.entries(value)
      .map(
        ([key, itemValue]) =>
          `${key}: ${itemValue}`
      )
      .filter(Boolean);
  }

  return [];
};

const formatList = (
  items,
  emptyText = "Not provided"
) => {
  const normalizedItems =
    normalizeArray(items);

  if (
    normalizedItems.length === 0
  ) {
    return `
      <span style="
        color: #777777;
        font-weight: 400;
      ">
        ${escapeHtml(emptyText)}
      </span>
    `;
  }

  return normalizedItems
    .map(
      (item) => `
        <div style="
          margin-bottom: 8px;
          padding: 10px 12px;
          background: #ffffff;
          border: 1px solid #e8e2d8;
          border-radius: 8px;
          color: #333333;
          line-height: 1.5;
        ">
          ${escapeHtml(item)}
        </div>
      `
    )
    .join("");
};

/* =========================================================
   PAN FORMATTER
========================================================= */

const formatPanRows = (
  pans
) => {
  if (
    !Array.isArray(pans) ||
    pans.length === 0
  ) {
    return `
      <tr>
        <td
          colspan="4"
          style="
            padding: 12px 0;
            color: #777777;
          "
        >
          No pan selection provided.
        </td>
      </tr>
    `;
  }

  return pans
    .map((pan) => {
      const name =
        pan?.name ||
        "Pan";

      const quantity =
        Number(
          pan?.quantity || 0
        );

      const price =
        Number(
          pan?.price || 0
        );

      const subtotal =
        quantity * price;

      return `
        <tr>

          <td style="
            padding: 11px 0;
            color: #777777;
            border-bottom: 1px solid #e8e2d8;
          ">
            ${escapeHtml(name)}
          </td>

          <td style="
            padding: 11px 0;
            color: #222222;
            font-weight: 600;
            text-align: center;
            border-bottom: 1px solid #e8e2d8;
          ">
            ${quantity}
          </td>

          <td style="
            padding: 11px 0;
            color: #222222;
            text-align: right;
            border-bottom: 1px solid #e8e2d8;
          ">
            $${price.toFixed(2)}
          </td>

          <td style="
            padding: 11px 0;
            color: #222222;
            font-weight: 700;
            text-align: right;
            border-bottom: 1px solid #e8e2d8;
          ">
            $${subtotal.toFixed(2)}
          </td>

        </tr>
      `;
    })
    .join("");
};

/* =========================================================
   PROTEIN FORMATTER
========================================================= */

const formatProteinRows = (
  proteins
) => {
  if (
    !Array.isArray(proteins) ||
    proteins.length === 0
  ) {
    return `
      <div style="
        padding: 12px;
        background: #ffffff;
        border: 1px solid #e8e2d8;
        border-radius: 8px;
        color: #777777;
      ">
        No protein selected.
      </div>
    `;
  }

  return proteins
    .map((protein) => {
      const name =
        protein?.name ||
        "Protein";

      const size =
        protein?.size ||
        "Not specified";

      const price =
        Number(
          protein?.price || 0
        );

      return `
        <div style="
          margin-bottom: 8px;
          padding: 11px 12px;
          background: #ffffff;
          border: 1px solid #e8e2d8;
          border-radius: 8px;
        ">

          <div style="
            display: table;
            width: 100%;
          ">

            <span style="
              display: table-cell;
              color: #333333;
              font-weight: 600;
            ">
              ${escapeHtml(name)}
            </span>

            <span style="
              display: table-cell;
              text-align: center;
              color: #777777;
            ">
              ${escapeHtml(size)}
            </span>

            <strong style="
              display: table-cell;
              text-align: right;
              color: #222222;
            ">
              $${price.toFixed(2)}
            </strong>

          </div>

        </div>
      `;
    })
    .join("");
};

/* =========================================================
   DELIVERY METHOD
========================================================= */

const formatDeliveryMethod = (
  deliveryMethod
) => {
  const value =
    String(
      deliveryMethod || ""
    )
      .trim()
      .toLowerCase();

  if (!value) {
    return "Not selected";
  }

  if (
    value.includes("uber")
  ) {
    return "Uber Eats";
  }

  if (
    value.includes("door")
  ) {
    return "DoorDash";
  }

  if (
    value.includes("pickup") ||
    value.includes("pick-up") ||
    value.includes("self")
  ) {
    return "Self Pick-Up";
  }

  if (
    value.includes("delivery")
  ) {
    return "Delivery";
  }

  if (
    value.includes("late")
  ) {
    return "Late Order";
  }

  return deliveryMethod;
};

/* =========================================================
   LATE ORDER
========================================================= */

const formatLateOrder = (
  lateOrder,
  lateOrderCharge
) => {
  const isLate =
    lateOrder === true ||
    lateOrder === "true" ||
    lateOrder === "yes" ||
    lateOrder === "Yes";

  if (!isLate) {
    return "No";
  }

  const charge =
    String(
      lateOrderCharge || ""
    ).trim();

  if (charge) {
    return `Yes — Extra charge: ${charge}`;
  }

  return "Yes — Extra charge applies";
};

/* =========================================================
   MONEY
========================================================= */

const formatMoney = (
  amount,
  currency = "usd"
) => {
  return `${String(
    currency
  ).toUpperCase()} ${(
    Number(amount || 0) / 100
  ).toFixed(2)}`;
};

/* =========================================================
   DESCRIPTION
========================================================= */

const formatDescription = (
  description = ""
) => {
  if (!description) {
    return "";
  }

  const parts = String(
    description
  )
    .split(" • ")
    .map((part) =>
      part.trim()
    )
    .filter(Boolean);

  if (
    parts.length === 0
  ) {
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
          const separatorIndex =
            part.indexOf(":");

          if (
            separatorIndex === -1
          ) {
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

          const label =
            part
              .slice(
                0,
                separatorIndex
              )
              .trim();

          const value =
            part
              .slice(
                separatorIndex + 1
              )
              .trim();

          return `
            <div style="
              margin-bottom: 7px;
              font-size: 13px;
              line-height: 1.6;
            ">

              <strong style="
                color: #333;
              ">
                ${escapeHtml(label)}:
              </strong>

              <span style="
                color: #666;
              ">
                ${escapeHtml(value)}
              </span>

            </div>
          `;
        })
        .join("")}

    </div>
  `;
};

/* =========================================================
   CUSTOMER ORDER ITEMS
========================================================= */

const createCustomerItemsHtml = (
  items = [],
  currency
) => {
  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  if (
    safeItems.length === 0
  ) {
    return `
      <tr>
        <td
          colspan="3"
          style="
            padding: 18px 0;
            color: #777;
            text-align: center;
          "
        >
          No order items available.
        </td>
      </tr>
    `;
  }

  return safeItems
    .map(
      (item) => `
        <tr>

          <td style="
            padding: 18px 0;
            border-bottom:
              1px solid #e5e0d6;
            vertical-align: top;
          ">

            <strong style="
              color: #1a1a1a;
              font-size: 15px;
            ">
              ${escapeHtml(
                item?.name ||
                  "Ify's Signature Fried Rice"
              )}
            </strong>

            ${formatDescription(
              item?.description
            )}

          </td>

          <td style="
            padding: 18px 10px;
            border-bottom:
              1px solid #e5e0d6;
            text-align: center;
            vertical-align: top;
            white-space: nowrap;
          ">
            ${Number(
              item?.quantity || 1
            )}
          </td>

          <td style="
            padding: 18px 0;
            border-bottom:
              1px solid #e5e0d6;
            text-align: right;
            vertical-align: top;
            white-space: nowrap;
            font-weight: bold;
          ">
            ${formatMoney(
              item?.amount,
              currency
            )}
          </td>

        </tr>
      `
    )
    .join("");
};

/* =========================================================
   BUSINESS ORDER ITEMS
========================================================= */

const createBusinessItemsHtml = (
  items = [],
  currency
) => {
  const safeItems =
    Array.isArray(items)
      ? items
      : [];

  if (
    safeItems.length === 0
  ) {
    return `
      <div style="
        padding: 18px;
        background: #faf8f3;
        border: 1px solid #eee8dc;
        border-radius: 10px;
        color: #777;
      ">
        No order items available.
      </div>
    `;
  }

  return safeItems
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
              item?.name ||
                "Ify's Signature Fried Rice"
            )}
          </div>

          ${formatDescription(
            item?.description
          )}

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
                ${Number(
                  item?.quantity || 1
                )}
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
                  item?.amount,
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

/*
|--------------------------------------------------------------------------
| CUSTOMER ORDER CONFIRMATION EMAIL
|--------------------------------------------------------------------------
*/

export const sendCustomerOrderEmail =
  async ({
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

    const formattedAmount =
      formatMoney(
        amount,
        currency
      );

    const safeCustomerName =
      escapeHtml(
        customerName || "there"
      );

    const safeOrderId =
      escapeHtml(
        orderId ||
          "Not available"
      );

    const itemsHtml =
      createCustomerItemsHtml(
        items,
        currency
      );

    const {
      data,
      error,
    } = await resend.emails.send({
      from: FROM_EMAIL,

      to: [customerEmail],

      subject:
        "Your Ify's Signature order is confirmed 🎉",

      html: `
        <div style="
          margin: 0;
          padding: 40px 20px;
          background: #f5f0e8;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #1a1a1a;
        ">

          <div style="
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
          ">

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
                Thank you for ordering from
                Ify's Signature.
                We've successfully received
                your payment and your order is
                now confirmed.
              </p>

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
                      border-bottom:
                        2px solid #d4a843;
                    ">
                      Item
                    </th>

                    <th style="
                      text-align: center;
                      padding: 10px;
                      border-bottom:
                        2px solid #d4a843;
                    ">
                      Qty
                    </th>

                    <th style="
                      text-align: right;
                      padding: 10px 0;
                      border-bottom:
                        2px solid #d4a843;
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
                  ${escapeHtml(
                    formattedAmount
                  )}
                </div>

              </div>

              <p style="
                margin-top: 30px;
                line-height: 1.7;
                color: #555;
              ">
                We'll be in touch with you
                regarding your order.
                Thank you for choosing
                Ify's Signature!
              </p>

              <p style="
                margin-top: 26px;
                color: #777;
                font-size: 13px;
                line-height: 1.6;
              ">
                This is an automated confirmation
                of your successful payment.
              </p>

            </div>

            <div style="
              padding: 24px 30px;
              background: #1a2e1a;
              color: #ffffff;
              text-align: center;
              font-size: 13px;
            ">
              © ${new Date().getFullYear()}
              Ify's Signature
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

/*
|--------------------------------------------------------------------------
| BUSINESS ORDER EMAIL
|--------------------------------------------------------------------------
*/

export const sendBusinessOrderEmail =
  async ({
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

    const formattedAmount =
      formatMoney(
        amount,
        currency
      );

    const safeCustomerName =
      escapeHtml(
        customerName ||
          "Not provided"
      );

    const safeCustomerEmail =
      escapeHtml(
        customerEmail ||
          "Not provided"
      );

    const safeCustomerPhone =
      escapeHtml(
        customerPhone ||
          "Not provided"
      );

    const safeOrderId =
      escapeHtml(
        orderId ||
          "Not available"
      );

    const itemsHtml =
      createBusinessItemsHtml(
        items,
        currency
      );

    const {
      data,
      error,
    } = await resend.emails.send({
      from: FROM_EMAIL,

      to: [adminEmail],

      subject:
        `New Ify's Signature order — ${formattedAmount}`,

      html: `
        <div style="
          margin: 0;
          padding: 40px 20px;
          background: #f5f0e8;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          color: #1a1a1a;
        ">

          <div style="
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
          ">

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
                A new payment has been
                successfully completed.
              </p>

            </div>

            <div style="
              padding: 32px 30px;
            ">

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

              <h2 style="
                margin-top: 30px;
                color: #1a2e1a;
              ">
                Order Details
              </h2>

              ${itemsHtml}

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
                  ${escapeHtml(
                    formattedAmount
                  )}
                </div>

              </div>

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

/*
|--------------------------------------------------------------------------
| QUOTE REQUEST EMAIL
|--------------------------------------------------------------------------
|
| Used by the "Request My Quote" form.
|
*/

export const sendQuoteRequestEmail =
  async ({
    name,
    email,
    phone,
    eventType,
    eventDate,

    pans,
    panSelections,

    proteins,
    proteinSelections,

    spiceLevel,
    spice,

    allergies,
    allergy,

    ingredientsToAvoid,
    excludedIngredients,

    deliveryMethod,
    deliveryOption,
    deliveryPlatform,

    location,

    lateOrder,
    lateOrderCharge,

    message,

    totalPans,
    estimatedTotal,
  }) => {
    /* =====================================================
       ADMIN EMAIL
    ===================================================== */

    const adminEmail =
      process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      throw new Error(
        "ADMIN_EMAIL is not configured."
      );
    }

    /* =====================================================
       RESEND API KEY
    ===================================================== */

    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        "RESEND_API_KEY is not configured."
      );
    }

    /* =====================================================
       REQUIRED FIELDS
    ===================================================== */

    if (
      !name ||
      !email ||
      !phone ||
      !eventType ||
      !eventDate
    ) {
      throw new Error(
        "Missing required quote request fields."
      );
    }

    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const selectedPans =
      pans ||
      panSelections ||
      [];

    const selectedProteins =
      proteins ||
      proteinSelections ||
      [];

    const selectedSpice =
      spiceLevel ||
      spice ||
      "Not selected";

    const selectedAllergies =
      allergies ||
      allergy ||
      "None reported";

    const selectedExcludedIngredients =
      ingredientsToAvoid ||
      excludedIngredients ||
      "None specified";

    const selectedDeliveryMethod =
      deliveryMethod ||
      deliveryOption ||
      deliveryPlatform ||
      "";

    const safeTotalPans =
      Number.isFinite(
        Number(totalPans)
      )
        ? Number(totalPans)
        : 0;

    const safeEstimatedTotal =
      Number.isFinite(
        Number(estimatedTotal)
      )
        ? Number(estimatedTotal)
        : 0;

    /* =====================================================
       DATE
    ===================================================== */

    const parsedEventDate =
      new Date(
        `${eventDate}T00:00:00`
      );

    const formattedDate =
      Number.isNaN(
        parsedEventDate.getTime()
      )
        ? String(eventDate)
        : parsedEventDate.toLocaleDateString(
            "en-US",
            {
              weekday:
                "long",
              year:
                "numeric",
              month:
                "long",
              day:
                "numeric",
            }
          );

    /* =====================================================
       SAFE VALUES
    ===================================================== */

    const safeName =
      escapeHtml(
        String(name).trim()
      );

    const safeEmail =
      escapeHtml(
        String(email).trim()
      );

    const safePhone =
      escapeHtml(
        String(phone).trim()
      );

    const safeEventType =
      escapeHtml(
        String(
          eventType
        ).trim()
      );

    const safeEventDate =
      escapeHtml(
        formattedDate
      );

    const safeLocation =
      escapeHtml(
        String(
          location ||
            "Not provided"
        ).trim()
      );

    const safeSpiceLevel =
      escapeHtml(
        String(
          selectedSpice
        ).trim()
      );

    const safeAllergies =
      escapeHtml(
        String(
          selectedAllergies
        ).trim()
      );

    const safeExcludedIngredients =
      escapeHtml(
        String(
          selectedExcludedIngredients
        ).trim()
      );

    const safeDeliveryMethod =
      escapeHtml(
        formatDeliveryMethod(
          selectedDeliveryMethod
        )
      );

    const safeLateOrder =
      escapeHtml(
        formatLateOrder(
          lateOrder,
          lateOrderCharge
        )
      );

    const safeMessage =
      escapeHtml(
        String(
          message ||
            "No additional details provided."
        ).trim()
      );

    /* =====================================================
       PAN / PROTEIN COUNTS
    ===================================================== */

    const normalizedPans =
      normalizeArray(
        selectedPans
      );

    const normalizedProteins =
      normalizeArray(
        selectedProteins
      );

    const panCount =
      normalizedPans.length;

    const proteinCount =
      normalizedProteins.length;

    const panRows =
      formatPanRows(
        selectedPans
      );

    const proteinHtml =
      formatProteinRows(
        selectedProteins
      );

    /* =====================================================
       SEND QUOTE EMAIL
    ===================================================== */

    const {
      data,
      error,
    } = await resend.emails.send({
      from: FROM_EMAIL,

      to: [adminEmail],

      replyTo: email,

      subject:
        `New Quote Request — ${name} — ${eventType}`,

      html: `
        <!DOCTYPE html>

        <html>

          <head>

            <meta charset="UTF-8" />

            <meta
              name="viewport"
              content="
                width=device-width,
                initial-scale=1.0
              "
            />

            <title>
              New Ify's Signature Quote Request
            </title>

          </head>

          <body style="
            margin: 0;
            padding: 0;
            background: #f5f0e8;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
            color: #1a1a1a;
          ">

            <div style="
              width: 100%;
              padding: 40px 15px;
              box-sizing: border-box;
            ">

              <div style="
                max-width: 680px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 18px;
                overflow: hidden;
                box-shadow:
                  0 10px 35px
                  rgba(0, 0, 0, 0.08);
              ">

                <!-- HEADER -->

                <div style="
                  background: #1a2e1a;
                  padding: 38px 30px;
                  text-align: center;
                ">

                  <div style="
                    color: #d4a843;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    margin-bottom: 10px;
                  ">
                    IFY'S SIGNATURE
                  </div>

                  <h1 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 27px;
                    line-height: 1.3;
                  ">
                    New Quote Request
                  </h1>

                  <p style="
                    margin: 10px 0 0;
                    color:
                      rgba(
                        255,
                        255,
                        255,
                        0.72
                      );
                    font-size: 14px;
                    line-height: 1.6;
                  ">
                    A new catering and fried rice
                    inquiry has been submitted.
                  </p>

                </div>

                <!-- INTRO -->

                <div style="
                  padding: 30px;
                  border-bottom:
                    1px solid #e8e2d8;
                ">

                  <p style="
                    margin: 0;
                    font-size: 15px;
                    line-height: 1.7;
                    color: #444444;
                  ">
                    You have received a new
                    quote request from
                    <strong>
                      ${safeName}
                    </strong>.
                    Here are the customer's
                    requested details.
                  </p>

                </div>

                <!-- CUSTOMER DETAILS -->

                <div style="
                  padding: 30px;
                ">

                  <h2 style="
                    margin: 0 0 20px;
                    color: #1a2e1a;
                    font-size: 19px;
                  ">
                    Customer Details
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse:
                        collapse;
                      font-size: 14px;
                    "
                  >

                    <tr>

                      <td style="
                        padding: 11px 0;
                        color: #777777;
                        width: 40%;
                        border-bottom:
                          1px solid #eee;
                      ">
                        Full Name
                      </td>

                      <td style="
                        padding: 11px 0;
                        color: #222222;
                        font-weight: 600;
                        border-bottom:
                          1px solid #eee;
                      ">
                        ${safeName}
                      </td>

                    </tr>

                    <tr>

                      <td style="
                        padding: 11px 0;
                        color: #777777;
                        border-bottom:
                          1px solid #eee;
                      ">
                        Email
                      </td>

                      <td style="
                        padding: 11px 0;
                        border-bottom:
                          1px solid #eee;
                      ">

                        <a
                          href="
                            mailto:${safeEmail}
                          "
                          style="
                            color: #2d4a2d;
                            text-decoration: none;
                          "
                        >
                          ${safeEmail}
                        </a>

                      </td>

                    </tr>

                    <tr>

                      <td style="
                        padding: 11px 0;
                        color: #777777;
                      ">
                        Phone
                      </td>

                      <td style="
                        padding: 11px 0;
                      ">

                        <a
                          href="
                            tel:${safePhone}
                          "
                          style="
                            color: #2d4a2d;
                            text-decoration: none;
                          "
                        >
                          ${safePhone}
                        </a>

                      </td>

                    </tr>

                  </table>

                </div>

                <!-- EVENT DETAILS -->

                <div style="
                  margin: 0 30px 25px;
                  padding: 25px;
                  background: #f8f5ef;
                  border-radius: 14px;
                ">

                  <h2 style="
                    margin: 0 0 20px;
                    color: #1a2e1a;
                    font-size: 18px;
                  ">
                    Event Details
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse:
                        collapse;
                      font-size: 14px;
                    "
                  >

                    <tr>

                      <td style="
                        padding: 9px 0;
                        color: #777777;
                        width: 42%;
                      ">
                        Event Type
                      </td>

                      <td style="
                        padding: 9px 0;
                        color: #222222;
                        font-weight: 600;
                      ">
                        ${safeEventType}
                      </td>

                    </tr>

                    <tr>

                      <td style="
                        padding: 9px 0;
                        color: #777777;
                      ">
                        Event Date
                      </td>

                      <td style="
                        padding: 9px 0;
                        color: #222222;
                        font-weight: 600;
                      ">
                        ${safeEventDate}
                      </td>

                    </tr>

                    <tr>

                      <td style="
                        padding: 9px 0;
                        color: #777777;
                      ">
                        Location
                      </td>

                      <td style="
                        padding: 9px 0;
                        color: #222222;
                        font-weight: 600;
                      ">
                        ${safeLocation}
                      </td>

                    </tr>

                  </table>

                </div>

                <!-- PAN SELECTION -->

                <div style="
                  margin: 0 30px 25px;
                  padding: 25px;
                  background: #ffffff;
                  border:
                    1px solid #e8e2d8;
                  border-radius: 14px;
                ">

                  <h2 style="
                    margin: 0 0 6px;
                    color: #1a2e1a;
                    font-size: 18px;
                  ">
                    Pan Selection
                  </h2>

                  <p style="
                    margin: 0 0 18px;
                    color: #777777;
                    font-size: 13px;
                  ">
                    ${safeTotalPans}
                    total pan${
                      safeTotalPans === 1
                        ? ""
                        : "s"
                    }
                  </p>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse:
                        collapse;
                      font-size: 14px;
                    "
                  >

                    <thead>

                      <tr>

                        <th style="
                          padding: 10px 0;
                          color: #777777;
                          text-align: left;
                          border-bottom:
                            2px solid #d4a843;
                        ">
                          Pan
                        </th>

                        <th style="
                          padding: 10px 0;
                          color: #777777;
                          text-align: center;
                          border-bottom:
                            2px solid #d4a843;
                        ">
                          Qty
                        </th>

                        <th style="
                          padding: 10px 0;
                          color: #777777;
                          text-align: right;
                          border-bottom:
                            2px solid #d4a843;
                        ">
                          Unit
                        </th>

                        <th style="
                          padding: 10px 0;
                          color: #777777;
                          text-align: right;
                          border-bottom:
                            2px solid #d4a843;
                        ">
                          Total
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      ${panRows}

                    </tbody>

                  </table>

                </div>

                <!-- QUOTE ESTIMATE -->

                <div style="
                  margin: 0 30px 25px;
                  padding: 25px;
                  background: #1a2e1a;
                  border-radius: 14px;
                ">

                  <h2 style="
                    margin: 0 0 18px;
                    color: #ffffff;
                    font-size: 18px;
                  ">
                    Quote Estimate
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse:
                        collapse;
                      font-size: 14px;
                    "
                  >

                    <tr>

                      <td style="
                        padding: 10px 0;
                        color:
                          rgba(
                            255,
                            255,
                            255,
                            0.72
                          );
                      ">
                        Total Pans
                      </td>

                      <td style="
                        padding: 10px 0;
                        color: #ffffff;
                        font-weight: 700;
                        text-align: right;
                      ">
                        ${safeTotalPans}
                      </td>

                    </tr>

                    <tr>

                      <td style="
                        padding: 14px 0 0;
                        color:
                          rgba(
                            255,
                            255,
                            255,
                            0.72
                          );
                        border-top:
                          1px solid
                          rgba(
                            255,
                            255,
                            255,
                            0.15
                          );
                      ">
                        Estimated Total
                      </td>

                      <td style="
                        padding: 14px 0 0;
                        color: #f0d98c;
                        font-size: 22px;
                        font-weight: 700;
                        text-align: right;
                        border-top:
                          1px solid
                          rgba(
                            255,
                            255,
                            255,
                            0.15
                          );
                      ">
                        $${safeEstimatedTotal.toFixed(
                          2
                        )}
                      </td>

                    </tr>

                  </table>

                  <p style="
                    margin: 15px 0 0;
                    color:
                      rgba(
                        255,
                        255,
                        255,
                        0.62
                      );
                    font-size: 12px;
                    line-height: 1.5;
                  ">
                    This is an estimated quote based
                    on the customer's selections.
                    Final pricing may be confirmed
                    by Ify's Signature.
                  </p>

                </div>

                <!-- PROTEINS -->

                <div style="
                  margin: 0 30px 25px;
                  padding: 25px;
                  background: #f8f5ef;
                  border-radius: 14px;
                ">

                  <h2 style="
                    margin: 0 0 6px;
                    color: #1a2e1a;
                    font-size: 18px;
                  ">
                    Protein Selection
                  </h2>

                  <p style="
                    margin: 0 0 16px;
                    color: #777777;
                    font-size: 13px;
                  ">
                    ${proteinCount}
                    protein selection${
                      proteinCount === 1
                        ? ""
                        : "s"
                    }
                  </p>

                  ${proteinHtml}

                </div>

                <!-- FOOD PREFERENCES -->

                <div style="
                  margin: 0 30px 25px;
                  padding: 25px;
                  background: #ffffff;
                  border:
                    1px solid #e8e2d8;
                  border-radius: 14px;
                ">

                  <h2 style="
                    margin: 0 0 20px;
                    color: #1a2e1a;
                    font-size: 18px;
                  ">
                    Food Preferences
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse:
                        collapse;
                      font-size: 14px;
                    "
                  >

                    <tr>

                      <td style="
                        padding: 11px 0;
                        color: #777777;
                        width: 42%;
                        border-bottom:
                          1px solid #eee;
                      ">
                        Spice Level
                      </td>

                      <td style="
                        padding: 11px 0;
                        color: #222222;
                        font-weight: 600;
                        border-bottom:
                          1px solid #eee;
                      ">
                        ${safeSpiceLevel}
                      </td>

                    </tr>

                    <tr>

                      <td style="
                        padding: 11px 0;
                        color: #777777;
                        border-bottom:
                          1px solid #eee;
                      ">
                        Allergies
                      </td>

                      <td style="
                        padding: 11px 0;
                        color: #222222;
                        font-weight: 600;
                        border-bottom:
                          1px solid #eee;
                      ">
                        ${safeAllergies}
                      </td>

                    </tr>

                    <tr>

                      <td style="
                        padding: 11px 0;
                        color: #777777;
                      ">
                        Ingredients to Avoid
                      </td>

                      <td style="
                        padding: 11px 0;
                        color: #222222;
                        font-weight: 600;
                      ">
                        ${safeExcludedIngredients}
                      </td>

                    </tr>

                  </table>

                </div>

                <!-- DELIVERY -->

                <div style="
                  margin: 0 30px 25px;
                  padding: 25px;
                  background: #f8f5ef;
                  border-radius: 14px;
                ">

                  <h2 style="
                    margin: 0 0 20px;
                    color: #1a2e1a;
                    font-size: 18px;
                  ">
                    Delivery & Pick-Up
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse:
                        collapse;
                      font-size: 14px;
                    "
                  >

                    <tr>

                      <td style="
                        padding: 10px 0;
                        color: #777777;
                        width: 42%;
                        border-bottom:
                          1px solid #e5dfd3;
                      ">
                        Order Method
                      </td>

                      <td style="
                        padding: 10px 0;
                        color: #222222;
                        font-weight: 700;
                        border-bottom:
                          1px solid #e5dfd3;
                      ">
                        ${safeDeliveryMethod}
                      </td>

                    </tr>

                    <tr>

                      <td style="
                        padding: 10px 0;
                        color: #777777;
                        border-bottom:
                          1px solid #e5dfd3;
                      ">
                        Late Order
                      </td>

                      <td style="
                        padding: 10px 0;
                        color: #222222;
                        font-weight: 700;
                        border-bottom:
                          1px solid #e5dfd3;
                      ">
                        ${safeLateOrder}
                      </td>

                    </tr>

                    <tr>

                      <td style="
                        padding: 10px 0;
                        color: #777777;
                      ">
                        Delivery Location
                      </td>

                      <td style="
                        padding: 10px 0;
                        color: #222222;
                        font-weight: 600;
                      ">
                        ${safeLocation}
                      </td>

                    </tr>

                  </table>

                </div>

                <!-- ADDITIONAL MESSAGE -->

                <div style="
                  padding: 0 30px 30px;
                ">

                  <h2 style="
                    margin: 0 0 15px;
                    color: #1a2e1a;
                    font-size: 18px;
                  ">
                    Additional Details
                  </h2>

                  <div style="
                    padding: 18px;
                    background: #fafafa;
                    border-left:
                      3px solid #d4a843;
                    border-radius: 6px;
                    color: #555555;
                    font-size: 14px;
                    line-height: 1.7;
                  ">
                    ${safeMessage}
                  </div>

                </div>

                <!-- ACTION -->

                <div style="
                  padding: 28px 30px;
                  background: #1a2e1a;
                  text-align: center;
                ">

                  <p style="
                    margin: 0 0 15px;
                    color:
                      rgba(
                        255,
                        255,
                        255,
                        0.72
                      );
                    font-size: 12px;
                  ">
                    Ready to follow up with
                    ${safeName}?
                  </p>

                  <a
                    href="
                      mailto:${safeEmail}
                    "
                    style="
                      display: inline-block;
                      padding: 13px 24px;
                      background: #d4a843;
                      color: #1a2e1a;
                      border-radius: 999px;
                      text-decoration: none;
                      font-size: 13px;
                      font-weight: 700;
                    "
                  >
                    Reply to ${safeName}
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
        "QUOTE EMAIL ERROR:",
        error
      );

      throw error;
    }

    console.log(
      `Quote request email sent: ${
        data?.id || "unknown"
      }`
    );

    return data;
  };