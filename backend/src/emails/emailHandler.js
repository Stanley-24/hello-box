import { resendClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"



export const sendWelcomeEmail = async (email, name, clientUrl) => {
  const {data, error} = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Hello Box!",
    html: createWelcomeEmailTemplate(name, clientUrl),
  });
  
  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
  
  console.log("Welcome email sent successfully:", data);
  return data;
}