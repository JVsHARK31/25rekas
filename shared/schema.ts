import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["super_admin", "operator", "viewer"]);
export const workflowStatusEnum = pgEnum("workflow_status", ["draft", "submitted", "review", "approved", "rejected"]);
export const fileTypeEnum = pgEnum("file_type", ["pdf", "docx", "jpg", "png"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default("viewer"),
  schoolName: text("school_name"),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// RKAS Bidang (Fields)
export const rkasFields = pgTable("rkas_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  kodeBidang: text("kode_bidang").notNull().unique(),
  namaBidang: text("nama_bidang").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// RKAS Standards
export const rkasStandards = pgTable("rkas_standards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fieldId: varchar("field_id").notNull().references(() => rkasFields.id, { onDelete: "cascade" }),
  kodeStandar: text("kode_standar").notNull(),
  namaStandar: text("nama_standar").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// RKAS Activities
export const rkasActivities = pgTable("rkas_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  standardId: varchar("standard_id").notNull().references(() => rkasStandards.id, { onDelete: "cascade" }),
  kodeGiat: text("kode_giat").notNull().unique(),
  namaGiat: text("nama_giat").notNull(),
  subtitle: text("subtitle"),
  kodeDana: text("kode_dana").notNull(),
  namaDana: text("nama_dana").notNull(),
  tw1: decimal("tw1", { precision: 15, scale: 2 }).notNull().default("0"),
  tw2: decimal("tw2", { precision: 15, scale: 2 }).notNull().default("0"),
  tw3: decimal("tw3", { precision: 15, scale: 2 }).notNull().default("0"),
  tw4: decimal("tw4", { precision: 15, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 15, scale: 2 }).notNull().default("0"),
  realisasi: decimal("realisasi", { precision: 15, scale: 2 }).notNull().default("0"),
  tanggal: timestamp("tanggal"),
  noPesanan: text("no_pesanan"),
  status: workflowStatusEnum("status").notNull().default("draft"),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Files table
export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activityId: varchar("activity_id").references(() => rkasActivities.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: fileTypeEnum("file_type").notNull(),
  filePath: text("file_path").notNull(),
  category: text("category"),
  uploadedBy: varchar("uploaded_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Audit logs
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id"),
  oldData: text("old_data"),
  newData: text("new_data"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(rkasActivities),
  files: many(files),
  auditLogs: many(auditLogs),
}));

export const rkasFieldsRelations = relations(rkasFields, ({ many }) => ({
  standards: many(rkasStandards),
}));

export const rkasStandardsRelations = relations(rkasStandards, ({ one, many }) => ({
  field: one(rkasFields, {
    fields: [rkasStandards.fieldId],
    references: [rkasFields.id],
  }),
  activities: many(rkasActivities),
}));

export const rkasActivitiesRelations = relations(rkasActivities, ({ one, many }) => ({
  standard: one(rkasStandards, {
    fields: [rkasActivities.standardId],
    references: [rkasStandards.id],
  }),
  createdByUser: one(users, {
    fields: [rkasActivities.createdBy],
    references: [users.id],
  }),
  files: many(files),
}));

export const filesRelations = relations(files, ({ one }) => ({
  activity: one(rkasActivities, {
    fields: [files.activityId],
    references: [rkasActivities.id],
  }),
  uploadedByUser: one(users, {
    fields: [files.uploadedBy],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRkasFieldSchema = createInsertSchema(rkasFields).omit({
  id: true,
  createdAt: true,
});

export const insertRkasStandardSchema = createInsertSchema(rkasStandards).omit({
  id: true,
  createdAt: true,
});

export const insertRkasActivitySchema = createInsertSchema(rkasActivities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  total: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRkasField = z.infer<typeof insertRkasFieldSchema>;
export type RkasField = typeof rkasFields.$inferSelect;
export type InsertRkasStandard = z.infer<typeof insertRkasStandardSchema>;
export type RkasStandard = typeof rkasStandards.$inferSelect;
export type InsertRkasActivity = z.infer<typeof insertRkasActivitySchema>;
export type RkasActivity = typeof rkasActivities.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
