export const API_ROUTES = {
  PUBLIC: {
    BRAND: '/public/brand',
    SERVICES: '/public/services',
    AVAILABILITY: '/public/availability',
    APPOINTMENTS: '/public/appointments',
    PAYMENTS: '/public/payments',
    WEBHOOKS: '/public/webhooks',
  },
  
  ADMIN: {
    APPOINTMENTS: '/admin/appointments',
    SERVICES: '/admin/services',
    BRAND: '/admin/brand',
    STYLISTS: '/admin/stylists',
    CLIENTS: '/admin/clients',
    REPORTS: '/admin/reports',
    EMAIL: '/admin/email',
    SMS: '/admin/sms',
    WEBSITE: '/admin/website',
  },
} as const;

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PARKED: 'PARKED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;

export const USER_ROLES = {
  OWNER: 'owner',
  MEMBER: 'member',
} as const;

export const CAMPAIGN_STATUS = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  SENDING: 'SENDING',
  SENT: 'SENT',
  CANCELLED: 'CANCELLED',
} as const;

export const BUSINESS_HOURS_DEFAULT = {
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  wednesday: { open: '09:00', close: '17:00' },
  thursday: { open: '09:00', close: '17:00' },
  friday: { open: '09:00', close: '17:00' },
  saturday: { open: '10:00', close: '16:00' },
  sunday: { closed: true },
} as const;

export const SMS_COMPLIANCE = {
  QUIET_HOURS: {
    START: '20:00', // 8 PM
    END: '08:00',   // 8 AM
  },
  KEYWORDS: {
    STOP: ['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'],
    START: ['START', 'YES', 'UNSTOP'],
    HELP: ['HELP', 'INFO'],
  },
} as const;

export const EMAIL_COMPLIANCE = {
  UNSUBSCRIBE_HEADER: 'List-Unsubscribe',
  UNSUBSCRIBE_POST_HEADER: 'List-Unsubscribe-Post',
} as const;

export const RATE_LIMITS = {
  PUBLIC_API: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  ADMIN_API: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 1000,
  },
  BOOKING: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 5,
  },
} as const;
