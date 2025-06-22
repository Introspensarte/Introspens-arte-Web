import { 
  users, 
  activities, 
  news, 
  announcements, 
  activitiesToDo,
  type User, 
  type InsertUser,
  type Activity,
  type InsertActivity,
  type News,
  type InsertNews,
  type Announcement,
  type InsertAnnouncement,
  type ActivityToDo,
  type InsertActivityToDo
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserBySignature(signature: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: number, traces: number, words: number): Promise<void>;
  getUserRankings(orderBy: 'traces' | 'words'): Promise<User[]>;
  
  // Activity management
  createActivity(activity: InsertActivity & { userId: number, traces: number }): Promise<Activity>;
  getUserActivities(userId: number): Promise<Activity[]>;
  
  // Content management
  createNews(news: InsertNews & { authorId: number }): Promise<News>;
  getAllNews(): Promise<(News & { author: User })[]>;
  createAnnouncement(announcement: InsertAnnouncement & { authorId: number }): Promise<Announcement>;
  getAllAnnouncements(): Promise<(Announcement & { author: User })[]>;
  createActivityToDo(activityToDo: InsertActivityToDo & { authorId: number }): Promise<ActivityToDo>;
  getAllActivitiesToDo(): Promise<(ActivityToDo & { author: User })[]>;
  
  // Admin management
  makeUserAdmin(userId: number): Promise<void>;
  removeUserAdmin(userId: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserBySignature(signature: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.signature, signature));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Set admin status for #INELUDIBLE
    const userData = {
      ...insertUser,
      isAdmin: insertUser.signature === "#INELUDIBLE"
    };
    
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUserStats(userId: number, traces: number, words: number): Promise<void> {
    await db
      .update(users)
      .set({
        totalTraces: sql`${users.totalTraces} + ${traces}`,
        totalWords: sql`${users.totalWords} + ${words}`,
        totalActivities: sql`${users.totalActivities} + 1`,
      })
      .where(eq(users.id, userId));
  }

  async getUserRankings(orderBy: 'traces' | 'words'): Promise<User[]> {
    const column = orderBy === 'traces' ? users.totalTraces : users.totalWords;
    return await db
      .select()
      .from(users)
      .orderBy(desc(column));
  }

  async createActivity(activityData: InsertActivity & { userId: number, traces: number }): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(activityData)
      .returning();
    
    // Update user stats
    await this.updateUserStats(activityData.userId, activityData.traces, activityData.words);
    
    return activity;
  }

  async getUserActivities(userId: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
  }

  async createNews(newsData: InsertNews & { authorId: number }): Promise<News> {
    const [newsItem] = await db
      .insert(news)
      .values(newsData)
      .returning();
    return newsItem;
  }

  async getAllNews(): Promise<(News & { author: User })[]> {
    const results = await db
      .select({
        id: news.id,
        title: news.title,
        content: news.content,
        authorId: news.authorId,
        createdAt: news.createdAt,
        author: users,
      })
      .from(news)
      .leftJoin(users, eq(news.authorId, users.id))
      .orderBy(desc(news.createdAt));
    
    return results.filter(item => item.author !== null) as (News & { author: User })[];
  }

  async createAnnouncement(announcementData: InsertAnnouncement & { authorId: number }): Promise<Announcement> {
    const [announcement] = await db
      .insert(announcements)
      .values(announcementData)
      .returning();
    return announcement;
  }

  async getAllAnnouncements(): Promise<(Announcement & { author: User })[]> {
    const results = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        content: announcements.content,
        authorId: announcements.authorId,
        createdAt: announcements.createdAt,
        author: users,
      })
      .from(announcements)
      .leftJoin(users, eq(announcements.authorId, users.id))
      .orderBy(desc(announcements.createdAt));
    
    return results.filter(item => item.author !== null) as (Announcement & { author: User })[];
  }

  async createActivityToDo(activityToDoData: InsertActivityToDo & { authorId: number }): Promise<ActivityToDo> {
    const [activityToDo] = await db
      .insert(activitiesToDo)
      .values(activityToDoData)
      .returning();
    return activityToDo;
  }

  async getAllActivitiesToDo(): Promise<(ActivityToDo & { author: User })[]> {
    const results = await db
      .select({
        id: activitiesToDo.id,
        title: activitiesToDo.title,
        description: activitiesToDo.description,
        authorId: activitiesToDo.authorId,
        createdAt: activitiesToDo.createdAt,
        author: users,
      })
      .from(activitiesToDo)
      .leftJoin(users, eq(activitiesToDo.authorId, users.id))
      .orderBy(desc(activitiesToDo.createdAt));
    
    return results.filter(item => item.author !== null) as (ActivityToDo & { author: User })[];
  }

  async makeUserAdmin(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ isAdmin: true })
      .where(eq(users.id, userId));
  }

  async removeUserAdmin(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ isAdmin: false })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
