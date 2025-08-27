import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export const SortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('asc'),
});

export const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'like']),
  value: z.any(),
});

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  meta: z.object({
    pagination: PaginationSchema.optional(),
    total: z.number().optional(),
  }).optional(),
});

export const BrandSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  timezone: z.string(),
  depositPercentage: z.number(),
  cancellationPolicy: z.string().optional(),
  theme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    logoUrl: z.string().optional(),
    coverImageUrl: z.string().optional(),
  }).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }).optional(),
  businessHours: z.record(z.object({
    open: z.string(),
    close: z.string(),
    closed: z.boolean().optional(),
  })).optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  brandId: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  durationMinutes: z.number(),
  priceInCents: z.number(),
  depositInCents: z.number().optional(),
  category: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AppointmentStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'PARKED', 'CANCELLED', 'COMPLETED']);
export const PaymentStatusSchema = z.enum(['UNPAID', 'PAID', 'REFUNDED']);

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  brandId: z.string().uuid(),
  serviceId: z.string().uuid(),
  stylistId: z.string().uuid(),
  clientId: z.string().uuid(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  status: AppointmentStatusSchema,
  paymentStatus: PaymentStatusSchema,
  totalAmountInCents: z.number(),
  depositAmountInCents: z.number().optional(),
  stripePaymentIntentId: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ClientSchema = z.object({
  id: z.string().uuid(),
  brandId: z.string().uuid(),
  email: z.string().email().optional(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const StylistSchema = z.object({
  id: z.string().uuid(),
  brandId: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  profileImageUrl: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAppointmentRequestSchema = z.object({
  serviceId: z.string().uuid(),
  stylistId: z.string().uuid(),
  startAt: z.string().datetime(),
  client: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export const AvailabilityRequestSchema = z.object({
  serviceId: z.string().uuid(),
  stylistId: z.string().uuid().optional(),
  date: z.string().date(),
});

export const AvailabilitySlotSchema = z.object({
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  stylistId: z.string().uuid(),
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type Sort = z.infer<typeof SortSchema>;
export type Filter = z.infer<typeof FilterSchema>;
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & { data?: T };
export type Brand = z.infer<typeof BrandSchema>;
export type Service = z.infer<typeof ServiceSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>;
export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type Client = z.infer<typeof ClientSchema>;
export type Stylist = z.infer<typeof StylistSchema>;
export type CreateAppointmentRequest = z.infer<typeof CreateAppointmentRequestSchema>;
export type AvailabilityRequest = z.infer<typeof AvailabilityRequestSchema>;
export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
