import * as nodemailer from 'nodemailer';
import { env } from '@repo/config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
}

let transporter: nodemailer.Transporter;

if (env.POSTMARK_API_TOKEN) {
  transporter = nodemailer.createTransport({
    host: 'smtp.postmarkapp.com',
    port: 587,
    secure: false,
    auth: {
      user: env.POSTMARK_API_TOKEN,
      pass: env.POSTMARK_API_TOKEN,
    },
  });
} else if (env.SENDGRID_API_KEY) {
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: env.SENDGRID_API_KEY,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@salonx.com',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      headers: options.headers,
    };

    const result = await transporter.sendMail(mailOptions);
    
    if (env.NODE_ENV === 'development') {
      console.log('Email sent:', result);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
