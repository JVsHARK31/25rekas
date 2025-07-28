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

// RKAS Activities table - matching existing database structure
export const rkasActivities = pgTable("rkas_activities", {
  id: varchar("id").primaryKey(),
  standardId: varchar("standard_id"),
  kodeGiat: text("kode_giat"),
  namaGiat: text("nama_giat"),
  subtitle: text("subtitle"),
  kodeDana: text("kode_dana"),
  namaDana: text("nama_dana"),
  tw1: decimal("tw1"),
  tw2: decimal("tw2"),  
  tw3: decimal("tw3"),
  tw4: decimal("tw4"),
  total: decimal("total"),
  realisasi: decimal("realisasi"),
  tanggal: date("tanggal"),
  noPesanan: text("no_pesanan"),
  status: varchar("status").notNull().default("draft"),
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertRKASActivitySchema = createInsertSchema(rkasActivities).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRKASBudgetItemSchema = createInsertSchema(rkasBudgetItems).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertUserData = z.infer<typeof insertUserSchema>;
export type InsertRKASActivityData = z.infer<typeof insertRKASActivitySchema>;
export type InsertRKASBudgetItemData = z.infer<typeof insertRKASBudgetItemSchema>;
export type InsertUserPreferenceData = z.infer<typeof insertUserPreferenceSchema>;