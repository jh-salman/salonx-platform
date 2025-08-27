import twilio from 'twilio';
import { env } from '@repo/config/env';

interface SmsOptions {
  to: string;
  message: string;
}

interface SmsResult {
  delivered: boolean;
  messageId?: string;
}

let twilioClient: twilio.Twilio | null = null;

if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
}

export async function sendSms(options: SmsOptions): Promise<SmsResult> {
  try {
    if (!twilioClient) {
      console.log('SMS (dev mode):', {
        to: options.to,
        message: options.message,
      });
      return { delivered: true, messageId: 'dev-mode' };
    }

    const message = await twilioClient.messages.create({
      body: options.message,
      from: env.TWILIO_PHONE_NUMBER,
      to: options.to,
    });

    return {
      delivered: message.status !== 'failed',
      messageId: message.sid,
    };
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
}

export async function handleSmsWebhook(body: any): Promise<void> {
  const { Body, From } = body;
  
  if (!Body || !From) {
    return;
  }

  const message = Body.trim().toUpperCase();
  
  if (['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'].includes(message)) {
    console.log(`SMS opt-out request from ${From}`);
    
    await sendSms({
      to: From,
      message: 'You have been unsubscribed from SMS messages. Reply START to opt back in.',
    });
  }
  
  if (['START', 'YES', 'UNSTOP'].includes(message)) {
    console.log(`SMS opt-in request from ${From}`);
    
    await sendSms({
      to: From,
      message: 'You have been subscribed to SMS messages. Reply STOP to opt out.',
    });
  }
  
  if (['HELP', 'INFO'].includes(message)) {
    await sendSms({
      to: From,
      message: 'SalonX SMS: Reply STOP to unsubscribe, START to subscribe. Msg&data rates may apply.',
    });
  }
}
