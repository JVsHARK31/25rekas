import { 
  users, 
  rkasActivities, 
  rkasBudgetItems, 
  userPreferences,
  type User, 
  type InsertUser,
  type RKASActivity,
  type InsertRKASActivity,
  type RKASBudgetItem,
  type InsertRKASBudgetItem,
  type UserPreference,
  type InsertUserPreference
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // RKAS Activity methods
  getActivities(): Promise<RKASActivity[]>;
  getActivity(id: string): Promise<RKASActivity | undefined>;
  createActivity(activity: InsertRKASActivity): Promise<RKASActivity>;
  updateActivity(id: string, activity: Partial<RKASActivity>): Promise<RKASActivity>;
  deleteActivity(id: string): Promise<void>;
  
  // RKAS Budget methods
  getBudgetItems(): Promise<RKASBudgetItem[]>;
  getBudgetItem(id: string): Promise<RKASBudgetItem | undefined>;
  createBudgetItem(item: InsertRKASBudgetItem): Promise<RKASBudgetItem>;
  updateBudgetItem(id: string, item: Partial<RKASBudgetItem>): Promise<RKASBudgetItem>;
  deleteBudgetItem(id: string): Promise<void>;
  
  // User Preferences methods
  getUserPreferences(userId: number): Promise<UserPreference | undefined>;
  saveUserPreferences(preferences: InsertUserPreference): Promise<UserPreference>;
  updateUserPreferences(userId: number, preferences: Partial<UserPreference>): Promise<UserPreference>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // RKAS Activity methods
  async getActivities(): Promise<RKASActivity[]> {
    return await db.select().from(rkasActivities);
  }

  async getActivity(id: string): Promise<RKASActivity | undefined> {
    const [activity] = await db.select().from(rkasActivities).where(eq(rkasActivities.id, id));
    return activity || undefined;
  }

  async createActivity(activity: InsertRKASActivity): Promise<RKASActivity> {
    const [newActivity] = await db
      .insert(rkasActivities)
      .values({
        ...activity,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newActivity;
  }

  async updateActivity(id: string, activity: Partial<RKASActivity>): Promise<RKASActivity> {
    const [updatedActivity] = await db
      .update(rkasActivities)
      .set({
        ...activity,
        updatedAt: new Date()
      })
      .where(eq(rkasActivities.id, id))
      .returning();
    return updatedActivity;
  }

  async deleteActivity(id: string): Promise<void> {
    await db.delete(rkasActivities).where(eq(rkasActivities.id, id));
  }

  // RKAS Budget methods
  async getBudgetItems(): Promise<RKASBudgetItem[]> {
    return await db.select().from(rkasBudgetItems);
  }

  async getBudgetItem(id: string): Promise<RKASBudgetItem | undefined> {
    const [item] = await db.select().from(rkasBudgetItems).where(eq(rkasBudgetItems.id, id));
    return item || undefined;
  }

  async createBudgetItem(item: InsertRKASBudgetItem): Promise<RKASBudgetItem> {
    const [newItem] = await db
      .insert(rkasBudgetItems)
      .values({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newItem;
  }

  async updateBudgetItem(id: string, item: Partial<RKASBudgetItem>): Promise<RKASBudgetItem> {
    const [updatedItem] = await db
      .update(rkasBudgetItems)
      .set({
        ...item,
        updatedAt: new Date()
      })
      .where(eq(rkasBudgetItems.id, id))
      .returning();
    return updatedItem;
  }

  async deleteBudgetItem(id: string): Promise<void> {
    await db.delete(rkasBudgetItems).where(eq(rkasBudgetItems.id, id));
  }

  // User Preferences methods
  async getUserPreferences(userId: number): Promise<UserPreference | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences || undefined;
  }

  async saveUserPreferences(preferences: InsertUserPreference): Promise<UserPreference> {
    // Try to update existing preferences first
    if (preferences.userId) {
      const existing = await this.getUserPreferences(preferences.userId);
      if (existing) {
        return await this.updateUserPreferences(preferences.userId, preferences);
      }
    }
    
    // Create new preferences
    const [newPreferences] = await db
      .insert(userPreferences)
      .values({
        ...preferences,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return newPreferences;
  }

  async updateUserPreferences(userId: number, preferences: Partial<UserPreference>): Promise<UserPreference> {
    const [updatedPreferences] = await db
      .update(userPreferences)
      .set({
        ...preferences,
        updatedAt: new Date()
      })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return updatedPreferences;
  }
}

export const storage = new DatabaseStorage();