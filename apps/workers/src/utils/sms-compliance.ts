import { SMS_COMPLIANCE } from '@repo/config/constants';

export function isQuietHours(timezone: string = 'America/New_York'): boolean {
  const now = new Date();
  const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const hour = localTime.getHours();
  
  return hour >= 20 || hour < 8;
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  
  return phone;
}
