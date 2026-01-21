import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  email: string,
  otp: string,
  type: 'sign-up' | 'sign-in' | 'email-verification' | 'forget-password'
) {
  let subject: string;
  let message: string;
  if (type === 'sign-in') {
    subject = 'Your sign-in code';
    message = `<p>Your sign-in code is <strong>${otp}</strong></p>`;
  } else if (type === 'email-verification') {
    subject = 'Verify your email';
    message = `<p>Your verification code is <strong>${otp}</strong></p>`;
  } else {
    subject = 'Reset your password';
    message = `<p>Your password reset code is <strong>${otp}</strong></p>`;
  }
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email.toLowerCase().trim(),
    subject,
    html: message,
  });
  return true;
}
