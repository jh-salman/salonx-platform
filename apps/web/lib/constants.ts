export const APP_NAME = "SalonX";
export const APP_DESCRIPTION = "Professional salon management platform";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  DASHBOARD: "/dashboard",
  APPOINTMENTS: "/dashboard/appointments",
  CLIENTS: "/dashboard/clients",
  SERVICES: "/dashboard/services",
  STYLISTS: "/dashboard/stylists",
  MARKETING: "/dashboard/marketing",
  REPORTS: "/dashboard/reports",
  SETTINGS: "/dashboard/settings",
  BOOKING: "/booking",
} as const;

export const APPOINTMENT_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PARKED: "parked",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  NO_SHOW: "no_show",
} as const;

export const PAYMENT_STATUSES = {
  UNPAID: "unpaid",
  PAID: "paid",
  REFUNDED: "refunded",
  PARTIAL: "partial",
} as const;

export const USER_ROLES = {
  OWNER: "owner",
  MEMBER: "member",
} as const;

export const SERVICE_CATEGORIES = [
  "Hair Cut & Style",
  "Hair Color",
  "Hair Treatment",
  "Nail Services",
  "Facial & Skincare",
  "Massage",
  "Waxing",
  "Eyebrow & Lash",
  "Makeup",
  "Other",
] as const;

export const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
] as const;

export const CURRENCIES = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
] as const;

export const BUSINESS_HOURS = [
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "20:00", label: "8:00 PM" },
] as const;

export const DURATIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 150, label: "2.5 hours" },
  { value: 180, label: "3 hours" },
] as const;

export const DATE_FORMATS = {
  SHORT: "MMM d",
  MEDIUM: "MMM d, yyyy",
  LONG: "MMMM d, yyyy",
  TIME: "h:mm a",
  DATETIME: "MMM d, yyyy 'at' h:mm a",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_SMS_LENGTH: 160,
  MAX_EMAIL_SUBJECT_LENGTH: 100,
  MIN_APPOINTMENT_DURATION: 15,
  MAX_APPOINTMENT_DURATION: 480,
} as const;
