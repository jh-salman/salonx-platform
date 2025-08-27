import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  brandName: z.string().min(2, "Brand name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number"),
  notes: z.string().optional(),
  preferences: z.string().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().optional(),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});

export const stylistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number"),
  specialties: z.array(z.string()).optional(),
  bio: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const appointmentSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  serviceId: z.string().min(1, "Service is required"),
  stylistId: z.string().min(1, "Stylist is required"),
  startAt: z.date(),
  notes: z.string().optional(),
});

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),
  stylistId: z.string().min(1, "Stylist is required"),
  startAt: z.date(),
  client: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number"),
  }),
  notes: z.string().optional(),
  acceptsTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  acceptsMarketing: z.boolean().optional(),
});

export const brandSettingsSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  timezone: z.string().min(1, "Timezone is required"),
  currency: z.string().min(3, "Currency is required"),
  depositPercentage: z.number().min(0).max(100, "Deposit percentage must be between 0 and 100"),
  cancellationPolicy: z.string().min(10, "Cancellation policy must be at least 10 characters"),
  theme: z.object({
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
    logo: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});

export const emailCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  listId: z.string().min(1, "Email list is required"),
  scheduledAt: z.date().optional(),
  sendImmediately: z.boolean().default(false),
});

export const smsCampaignSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(160, "Message must be 160 characters or less"),
  listId: z.string().min(1, "SMS list is required"),
  scheduledAt: z.date().optional(),
  sendImmediately: z.boolean().default(false),
});

export const step1RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const step2RegisterSchema = z.object({
  salonName: z.string().min(2, "Salon name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]{10,}$/, "Invalid phone number"),
  address: z.string().min(5, "Address is required"),
  timezone: z.string().min(1, "Timezone is required"),
});

export const step3RegisterSchema = z.object({
  services: z.array(z.object({
    name: z.string().min(1, "Service name is required"),
    duration: z.number().min(15, "Duration must be at least 15 minutes"),
    price: z.number().min(0, "Price must be positive"),
  })).min(1, "At least one service is required"),
});

export const step4RegisterSchema = z.object({
  teamMembers: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["stylist", "manager"]),
  })).optional(),
  skipTeamSetup: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type Step1RegisterInput = z.infer<typeof step1RegisterSchema>;
export type Step2RegisterInput = z.infer<typeof step2RegisterSchema>;
export type Step3RegisterInput = z.infer<typeof step3RegisterSchema>;
export type Step4RegisterInput = z.infer<typeof step4RegisterSchema>;
export type ClientInput = z.infer<typeof clientSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type StylistInput = z.infer<typeof stylistSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type BrandSettingsInput = z.infer<typeof brandSettingsSchema>;
export type EmailCampaignInput = z.infer<typeof emailCampaignSchema>;
export type SmsCampaignInput = z.infer<typeof smsCampaignSchema>;
