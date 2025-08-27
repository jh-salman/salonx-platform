import { pgTable, uuid, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { orgs } from './orgs';

export const brands = pgTable('brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => orgs.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  timezone: text('timezone').notNull().default('America/New_York'),
  depositPercentage: integer('deposit_percentage').notNull().default(50),
  cancellationPolicy: text('cancellation_policy'),
  theme: jsonb('theme').$type<{
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    coverImageUrl?: string;
  }>(),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  address: jsonb('address').$type<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>(),
  businessHours: jsonb('business_hours').$type<{
    [key: string]: { open: string; close: string; closed?: boolean };
  }>(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const insertBrandSchema = createInsertSchema(brands);
export const selectBrandSchema = createSelectSchema(brands);
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
