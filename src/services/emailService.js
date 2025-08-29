import SibApiV3Sdk from "@sendinblue/client";

const client = new SibApiV3Sdk.TransactionalEmailsApi();
client.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export async function sendWelcomeEmail(to, name) {
  const email = {
    sender: {
      name: "Choedra's Contact Manager",
      email: "no-reply@yourapp.com",
    },
    to: [{ email: to, name }],
    subject: "Welcome to Our App!",
    htmlContent: `<h1>Hi ${name}, welcome to our app!</h1><p>We’re excited to have you onboard.</p>`,
  };

  try {
    const response = await client.sendTransacEmail(email);
    console.log("Welcome email sent:", response);
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
}
