import { pgTable, text, varchar, integer, decimal, timestamp, boolean, serial, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("viewer"),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// RKAS Activities table
export const rkasActivities = pgTable("rkas_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 500 }).notNull(),
  description: text("description"),
  bidang: varchar("bidang", { length: 255 }).notNull(),
  standard: varchar("standard", { length: 500 }).notNull(),
  budget: decimal("budget", { precision: 15, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("draft"),
  quarter: varchar("quarter", { length: 10 }),
  month: integer("month"),
  year: integer("year").notNull(),
  responsible: varchar("responsible", { length: 255 }).notNull(),
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