import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { brands } from './brands.js';

export const stylists = pgTable('stylists', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  bio: text('bio'),
  profileImageUrl: text('profile_image_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const insertStylistSchema = createInsertSchema(stylists);
export const selectStylistSchema = createSelectSchema(stylists);
export type Stylist = typeof stylists.$inferSelect;
export type NewStylist = typeof stylists.$inferInsert;
