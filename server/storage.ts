import { 
  users, rkasFields, rkasStandards, rkasActivities, files, auditLogs,
  type User, type InsertUser, type RkasField, type InsertRkasField,
  type RkasStandard, type InsertRkasStandard, type RkasActivity, type InsertRkasActivity,
  type File, type InsertFile, type AuditLog, type InsertAuditLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  getAllUsers(): Promise<User[]>;
  verifyPassword(user: User, password: string): Promise<boolean>;

  // RKAS Fields
  getAllFields(): Promise<RkasField[]>;
  createField(field: InsertRkasField): Promise<RkasField>;

  // RKAS Standards
  getStandardsByField(fieldId: string): Promise<RkasStandard[]>;
  createStandard(standard: InsertRkasStandard): Promise<RkasStandard>;

  // RKAS Activities
  getAllActivities(): Promise<RkasActivity[]>;
  getActivitiesByStandard(standardId: string): Promise<RkasActivity[]>;
  createActivity(activity: InsertRkasActivity): Promise<RkasActivity>;
  updateActivity(id: string, updates: Partial<InsertRkasActivity>): Promise<RkasActivity>;
  deleteActivity(id: string): Promise<void>;

  // Files
  getFilesByActivity(activityId: string): Promise<File[]>;
  getAllFiles(): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: string): Promise<void>;

  // Audit logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, password: hashedPassword })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: sql`now()` })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  // RKAS Fields
  async getAllFields(): Promise<RkasField[]> {
    return await db.select().from(rkasFields).orderBy(rkasFields.kodeBidang);
  }

  async createField(field: InsertRkasField): Promise<RkasField> {
    const [newField] = await db.insert(rkasFields).values(field).returning();
    return newField;
  }

  // RKAS Standards
  async getStandardsByField(fieldId: string): Promise<RkasStandard[]> {
    return await db
      .select()
      .from(rkasStandards)
      .where(eq(rkasStandards.fieldId, fieldId))
      .orderBy(rkasStandards.kodeStandar);
  }

  async createStandard(standard: InsertRkasStandard): Promise<RkasStandard> {
    const [newStandard] = await db.insert(rkasStandards).values(standard).returning();
    return newStandard;
  }

  // RKAS Activities
  async getAllActivities(): Promise<RkasActivity[]> {
    return await db
      .select()
      .from(rkasActivities)
      .orderBy(rkasActivities.kodeGiat);
  }

  async getActivitiesByStandard(standardId: string): Promise<RkasActivity[]> {
    return await db
      .select()
      .from(rkasActivities)
      .where(eq(rkasActivities.standardId, standardId))
      .orderBy(rkasActivities.kodeGiat);
  }

  async createActivity(activity: InsertRkasActivity): Promise<RkasActivity> {
    const total = parseFloat(activity.tw1 || "0") + parseFloat(activity.tw2 || "0") + 
                  parseFloat(activity.tw3 || "0") + parseFloat(activity.tw4 || "0");
    
    const [newActivity] = await db
      .insert(rkasActivities)
      .values({ ...activity, total: total.toString() })
      .returning();
    return newActivity;
  }

  async updateActivity(id: string, updates: Partial<InsertRkasActivity>): Promise<RkasActivity> {
    let updateData: any = { ...updates, updatedAt: sql`now()` };
    
    // Recalculate total if quarterly values are updated
    if (updates.tw1 || updates.tw2 || updates.tw3 || updates.tw4) {
      const [current] = await db.select().from(rkasActivities).where(eq(rkasActivities.id, id));
      if (current) {
        const tw1 = parseFloat(updates.tw1 || current.tw1);
        const tw2 = parseFloat(updates.tw2 || current.tw2);
        const tw3 = parseFloat(updates.tw3 || current.tw3);
        const tw4 = parseFloat(updates.tw4 || current.tw4);
        updateData.total = (tw1 + tw2 + tw3 + tw4).toString();
      }
    }

    const [activity] = await db
      .update(rkasActivities)
      .set(updateData)
      .where(eq(rkasActivities.id, id))
      .returning();
    return activity;
  }

  async deleteActivity(id: string): Promise<void> {
    await db.delete(rkasActivities).where(eq(rkasActivities.id, id));
  }

  // Files
  async getFilesByActivity(activityId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.activityId, activityId))
      .orderBy(desc(files.createdAt));
  }

  async getAllFiles(): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .orderBy(desc(files.createdAt));
  }

  async createFile(file: InsertFile): Promise<File> {
    const [newFile] = await db.insert(files).values(file).returning();
    return newFile;
  }

  async deleteFile(id: string): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  // Audit logs
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [auditLog] = await db.insert(auditLogs).values(log).returning();
    return auditLog;
  }

  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
