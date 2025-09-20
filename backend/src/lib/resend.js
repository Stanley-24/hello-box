import {Resend} from 'resend';
import { ENV } from './env.js';

export const resendClient = new Resend(ENV.RESEND_API_KEY);

if (!ENV.RESEND_API_KEY) {
  console.warn("[resend] RESEND_API_KEY is not set; email sending will fail.");
}
if (!ENV.EMAIL_FROM || !ENV.EMAIL_FROM_NAME) {
  console.warn("[resend] EMAIL_FROM/EMAIL_FROM_NAME are not set; 'from' header may be invalid.");
}

export const sender = Object.freeze({
  email: ENV.EMAIL_FROM,
  name: ENV.EMAIL_FROM_NAME,
});