import dotenv from "dotenv";

dotenv.config();

const { default: express } = await import("express");
const { default: cors } = await import("cors");

const { default: stripeRoutes } = await import(
  "./routes/stripeRoutes.js"
);

const { default: webhookRoutes } = await import(
  "./routes/webhookRoutes.js"
);

const { default: newsletterRoutes } = await import(
  "./routes/newsletterRoutes.js"
);

const { default: contactRoutes } = await import(
  "./routes/contactRoutes.js"
);

const app = express();

const PORT = process.env.PORT || 5000;

/*
  ALLOWED FRONTEND ORIGINS
*/

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://ifys-signature.vercel.app",
  "https://ifyssignaturefriedrice.com",
  "https://www.ifyssignaturefriedrice.com",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

/*
  Remove duplicate origins
*/

const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

/*
  CORS
*/

app.use(
  cors({
    origin: (origin, callback) => {
      /*
        Requests without an Origin header can be allowed.
        This is useful for server-to-server requests such as
        Stripe webhooks.
      */
      if (!origin) {
        return callback(null, true);
      }

      if (uniqueAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(`CORS blocked origin: ${origin}`);

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },
    credentials: true,
  })
);

/*
  IMPORTANT:
  Stripe webhook must come BEFORE express.json()
  because Stripe requires the raw request body
  for signature verification.
*/

app.use("/api/webhook", webhookRoutes);

/*
  JSON BODY PARSER
*/

app.use(express.json());

/*
  HEALTH CHECK
*/

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Ify's Signature API is running.",
  });
});

/*
  STRIPE
*/

app.use("/api/stripe", stripeRoutes);

/*
  NEWSLETTER
*/

app.use("/api/newsletter", newsletterRoutes);

/*
  CONTACT / QUOTE REQUESTS
*/

app.use("/api/contact", contactRoutes);

/*
  404 HANDLER
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/*
  ERROR HANDLER
*/

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message:
      err.message ||
      "Something went wrong on the server.",
  });
});

/*
  START SERVER
*/

app.listen(PORT, () => {
  console.log(
    `Ify's Signature API running on http://localhost:${PORT}`
  );

  console.log(
    `Newsletter endpoint: http://localhost:${PORT}/api/newsletter/subscribe`
  );

  console.log(
    `Quote endpoint: http://localhost:${PORT}/api/contact/quote`
  );

  console.log(
    "Allowed frontend origins:",
    uniqueAllowedOrigins
  );
});