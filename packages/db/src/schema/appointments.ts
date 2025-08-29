import { pgTable, uuid, text, timestamp, integer, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { brands } from './brands.js';
import { services } from './services.js';
import { stylists } from './stylists.js';
import { clients } from './clients.js';

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'PENDING',
  'CONFIRMED', 
  'PARKED',
  'CANCELLED',
  'COMPLETED'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'UNPAID',
  'PAID', 
  'REFUNDED'
]);

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  stylistId: uuid('stylist_id').notNull().references(() => stylists.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  startAt: timestamp('start_at').notNull(),
  endAt: timestamp('end_at').notNull(),
  status: appointmentStatusEnum('status').notNull().default('PENDING'),
  paymentStatus: paymentStatusEnum('payment_status').notNull().default('UNPAID'),
  totalAmountInCents: integer('total_amount_in_cents').notNull(),
  depositAmountInCents: integer('deposit_amount_in_cents'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments);
export const selectAppointmentSchema = createSelectSchema(appointments);
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
