import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid", { length: 128 }).primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => ({
    expireIdx: index("IDX_session_expire").on(table.expire),
  }),
);

// User storage table for local authentication.
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 512 }),
  role: varchar("role", { length: 50 }).default('user'),
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: varchar("category", { length: 100 }).notNull(),
  published: boolean("published").default(false),
  authorId: varchar("author_id", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  avatar: varchar("avatar", { length: 512 }),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  featuredImage: text("featured_image"),
  category: varchar("category", { length: 100 }).notNull(),
  specifications: text("specifications"),
  published: boolean("published").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact inquiries table
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  topic: varchar("topic", { length: 100 }),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default('new'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Website content management table
export const websiteContent = pgTable("website_content", {
  id: serial("id").primaryKey(),
  section: varchar("section", { length: 100 }).notNull().unique(), // hero, about, contact, etc.
  title: varchar("title", { length: 500 }),
  subtitle: varchar("subtitle", { length: 500 }),
  content: text("content"),
  imageUrl: varchar("image_url", { length: 512 }),
  buttonText: varchar("button_text", { length: 100 }),
  buttonLink: varchar("button_link", { length: 255 }),
  additionalData: jsonb("additional_data"), // For flexible content storage
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media files table for image management
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: integer("size").notNull(),
  url: varchar("url", { length: 512 }).notNull(),
  alt: varchar("alt", { length: 255 }),
  category: varchar("category", { length: 100 }).default('general'),
  uploadedBy: varchar("uploaded_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Website settings table for global configurations
export const websiteSettings = pgTable("website_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }).default('text'), // text, number, boolean, json
  description: varchar("description", { length: 255 }),
  category: varchar("category", { length: 100 }).default('general'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

export type WebsiteContent = typeof websiteContent.$inferSelect;
export type InsertWebsiteContent = typeof websiteContent.$inferInsert;

export type MediaFile = typeof mediaFiles.$inferSelect;
export type InsertMediaFile = typeof mediaFiles.$inferInsert;

export type WebsiteSetting = typeof websiteSettings.$inferSelect;
export type InsertWebsiteSetting = typeof websiteSettings.$inferInsert;

// Insert schemas
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertWebsiteContentSchema = createInsertSchema(websiteContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMediaFileSchema = createInsertSchema(mediaFiles).omit({
  id: true,
  createdAt: true,
  uploadedBy: true,
});

export const insertWebsiteSettingSchema = createInsertSchema(websiteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export type InsertUserSchema = z.infer<typeof insertUserSchema>;
export type InsertBlogPostSchema = z.infer<typeof insertBlogPostSchema>;
export type InsertTestimonialSchema = z.infer<typeof insertTestimonialSchema>;
export type InsertProductSchema = z.infer<typeof insertProductSchema>;
export type InsertInquirySchema = z.infer<typeof insertInquirySchema>;
export type InsertWebsiteContentSchema = z.infer<typeof insertWebsiteContentSchema>;
export type InsertMediaFileSchema = z.infer<typeof insertMediaFileSchema>;
export type InsertWebsiteSettingSchema = z.infer<typeof insertWebsiteSettingSchema>;