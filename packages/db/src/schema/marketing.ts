import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { brands } from './brands';

export const campaignStatusEnum = pgEnum('campaign_status', ['DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'CANCELLED']);

export const websiteSettings = pgTable('website_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  isPublished: boolean('is_published').notNull().default(false),
  customDomain: text('custom_domain'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: text('seo_keywords'),
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  heroImageUrl: text('hero_image_url'),
  aboutText: text('about_text'),
  servicesText: text('services_text'),
  contactText: text('contact_text'),
  socialLinks: jsonb('social_links').$type<{
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  }>(),
  customCss: text('custom_css'),
  customJs: text('custom_js'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const emailTemplates = pgTable('email_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  htmlContent: text('html_content').notNull(),
  textContent: text('text_content'),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const emailLists = pgTable('email_lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const emailSubscribers = pgTable('email_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  isActive: boolean('is_active').notNull().default(true),
  optInDate: timestamp('opt_in_date'),
  optOutDate: timestamp('opt_out_date'),
  unsubscribeToken: text('unsubscribe_token').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const emailCampaigns = pgTable('email_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id').references(() => emailTemplates.id),
  listId: uuid('list_id').references(() => emailLists.id),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  htmlContent: text('html_content').notNull(),
  textContent: text('text_content'),
  status: campaignStatusEnum('status').notNull().default('DRAFT'),
  scheduledAt: timestamp('scheduled_at'),
  sentAt: timestamp('sent_at'),
  recipientCount: integer('recipient_count').default(0),
  openCount: integer('open_count').default(0),
  clickCount: integer('click_count').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const smsSubscribers = pgTable('sms_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  phone: text('phone').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  isActive: boolean('is_active').notNull().default(true),
  optInDate: timestamp('opt_in_date'),
  optOutDate: timestamp('opt_out_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const smsCampaigns = pgTable('sms_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  message: text('message').notNull(),
  status: campaignStatusEnum('status').notNull().default('DRAFT'),
  scheduledAt: timestamp('scheduled_at'),
  sentAt: timestamp('sent_at'),
  recipientCount: integer('recipient_count').default(0),
  deliveredCount: integer('delivered_count').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const shortLinks = pgTable('short_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandId: uuid('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  shortCode: text('short_code').notNull().unique(),
  originalUrl: text('original_url').notNull(),
  clickCount: integer('click_count').default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const insertWebsiteSettingsSchema = createInsertSchema(websiteSettings);
export const selectWebsiteSettingsSchema = createSelectSchema(websiteSettings);
export const insertEmailTemplateSchema = createInsertSchema(emailTemplates);
export const selectEmailTemplateSchema = createSelectSchema(emailTemplates);
export const insertEmailListSchema = createInsertSchema(emailLists);
export const selectEmailListSchema = createSelectSchema(emailLists);
export const insertEmailSubscriberSchema = createInsertSchema(emailSubscribers);
export const selectEmailSubscriberSchema = createSelectSchema(emailSubscribers);
export const insertEmailCampaignSchema = createInsertSchema(emailCampaigns);
export const selectEmailCampaignSchema = createSelectSchema(emailCampaigns);
export const insertSmsSubscriberSchema = createInsertSchema(smsSubscribers);
export const selectSmsSubscriberSchema = createSelectSchema(smsSubscribers);
export const insertSmsCampaignSchema = createInsertSchema(smsCampaigns);
export const selectSmsCampaignSchema = createSelectSchema(smsCampaigns);
export const insertShortLinkSchema = createInsertSchema(shortLinks);
export const selectShortLinkSchema = createSelectSchema(shortLinks);

export type WebsiteSettings = typeof websiteSettings.$inferSelect;
export type NewWebsiteSettings = typeof websiteSettings.$inferInsert;
export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type NewEmailTemplate = typeof emailTemplates.$inferInsert;
export type EmailList = typeof emailLists.$inferSelect;
export type NewEmailList = typeof emailLists.$inferInsert;
export type EmailSubscriber = typeof emailSubscribers.$inferSelect;
export type NewEmailSubscriber = typeof emailSubscribers.$inferInsert;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type NewEmailCampaign = typeof emailCampaigns.$inferInsert;
export type SmsSubscriber = typeof smsSubscribers.$inferSelect;
export type NewSmsSubscriber = typeof smsSubscribers.$inferInsert;
export type SmsCampaign = typeof smsCampaigns.$inferSelect;
export type NewSmsCampaign = typeof smsCampaigns.$inferInsert;
export type ShortLink = typeof shortLinks.$inferSelect;
export type NewShortLink = typeof shortLinks.$inferInsert;
