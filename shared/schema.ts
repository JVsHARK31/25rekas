import { pgTable, text, varchar, integer, decimal, timestamp, boolean, serial, uuid, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - matching existing database structure
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: varchar("role").notNull().default("viewer"),
  schoolName: text("school_name"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RKAS Activities table - matching actual database structure
export const rkasActivities = pgTable("rkas_activities", {
  id: varchar("id").primaryKey(),
  standard_id: varchar("standard_id").notNull(),
  kode_giat: text("kode_giat"),
  nama_giat: text("nama_giat").notNull(),
  subtitle: text("subtitle"),
  kode_dana: text("kode_dana").notNull(),
  nama_dana: text("nama_dana").notNull(),
  tw1: decimal("tw1").notNull(),
  tw2: decimal("tw2").notNull(),  
  tw3: decimal("tw3").notNull(),
  tw4: decimal("tw4").notNull(),
  total: decimal("total").notNull(),
  realisasi: decimal("realisasi").notNull(),
  tanggal: timestamp("tanggal"),
  no_pesanan: text("no_pesanan"),
  status: varchar("status").notNull().default("draft"),
  created_by: varchar("created_by").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// RKAS Budget Items table
export const rkasBudgetItems = pgTable("rkas_budget_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  activity: varchar("activity", { length: 500 }).notNull(),
  bidang: varchar("bidang", { length: 255 }).notNull(),
  standard: varchar("standard", { length: 500 }).notNull(),
  allocatedBudget: decimal("allocated_budget", { precision: 15, scale: 2 }).notNull(),
  usedBudget: decimal("used_budget", { precision: 15, scale: 2 }).notNull().default("0"),
  remainingBudget: decimal("remaining_budget", { precision: 15, scale: 2 }).notNull(),
  quarter: varchar("quarter", { length: 10 }),
  month: integer("month"),
  year: integer("year").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("on-track"),
  responsible: varchar("responsible", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Preferences table for saving period filters
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  periodType: varchar("period_type", { length: 20 }).notNull().default("quarterly"),
  selectedQuarter: varchar("selected_quarter", { length: 10 }),
  selectedMonth: integer("selected_month"),
  selectedYear: integer("selected_year").notNull().default(2025),
  lastUsedPage: varchar("last_used_page", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type RKASActivity = typeof rkasActivities.$inferSelect;
export type InsertRKASActivity = typeof rkasActivities.$inferInsert;

export type RKASBudgetItem = typeof rkasBudgetItems.$inferSelect;
export type InsertRKASBudgetItem = typeof rkasBudgetItems.$inferInsert;

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

// Zod schemas with proper transformations
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

export const insertRKASActivitySchema = createInsertSchema(rkasActivities).omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
}).extend({
  tw1: z.coerce.number().default(0),
  tw2: z.coerce.number().default(0),
  tw3: z.coerce.number().default(0),
  tw4: z.coerce.number().default(0),
  total: z.coerce.number().default(0),
  realisasi: z.coerce.number().default(0),
  created_by: z.string().default("admin-001")
});

export const insertRKASBudgetItemSchema = createInsertSchema(rkasBudgetItems).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  allocatedBudget: z.coerce.number().optional(),
  usedBudget: z.coerce.number().optional(),
  remainingBudget: z.coerce.number().default(0),
  year: z.coerce.number()
});

export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type InsertUserData = z.infer<typeof insertUserSchema>;
export type InsertRKASActivityData = z.infer<typeof insertRKASActivitySchema>;
export type InsertRKASBudgetItemData = z.infer<typeof insertRKASBudgetItemSchema>;
export type InsertUserPreferenceData = z.infer<typeof insertUserPreferenceSchema>;