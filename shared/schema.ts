import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  age: integer("age").notNull(),
  birthday: text("birthday").notNull(), // dd/mm format
  faceClaim: text("face_claim").notNull(),
  signature: text("signature").notNull().unique(), // starts with #
  motivation: text("motivation").notNull(),
  facebookLink: text("facebook_link").notNull(),
  isAdmin: boolean("is_admin").default(false),
  totalTraces: integer("total_traces").default(0),
  totalWords: integer("total_words").default(0),
  totalActivities: integer("total_activities").default(0),
  rank: text("rank").default("Alma en tránsito"),
  medal: text("medal").default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  words: integer("words").notNull(),
  type: text("type").notNull(), // narrativa, microcuento, drabble, hilo, rol, otro
  comments: integer("comments").default(0), // for hilo and rol types
  link: text("link").notNull(),
  description: text("description").notNull(),
  traces: integer("traces").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activitiesToDo = pgTable("activities_to_do", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(activities),
  news: many(news),
  announcements: many(announcements),
  activitiesToDo: many(activitiesToDo),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  author: one(users, {
    fields: [announcements.authorId],
    references: [users.id],
  }),
}));

export const activitiesToDoRelations = relations(activitiesToDo, ({ one }) => ({
  author: one(users, {
    fields: [activitiesToDo.authorId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
  totalTraces: true,
  totalWords: true,
  totalActivities: true,
  rank: true,
  medal: true,
  createdAt: true,
}).extend({
  signature: z.string().regex(/^#.+/, "Signature must start with #"),
  birthday: z.string().regex(/^\d{2}\/\d{2}$/, "Birthday must be in dd/mm format"),
  age: z.number().min(13).max(100),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  userId: true,
  traces: true,
  createdAt: true,
}).extend({
  type: z.enum(["narrativa", "microcuento", "drabble", "hilo", "rol", "otro"]),
  words: z.number().min(1),
  comments: z.number().min(0).optional(),
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  authorId: true,
  createdAt: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  authorId: true,
  createdAt: true,
});

export const insertActivityToDoSchema = createInsertSchema(activitiesToDo).omit({
  id: true,
  authorId: true,
  createdAt: true,
});

export const loginSchema = z.object({
  signature: z.string().regex(/^#.+/, "Signature must start with #"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type ActivityToDo = typeof activitiesToDo.$inferSelect;
export type InsertActivityToDo = z.infer<typeof insertActivityToDoSchema>;
export type LoginData = z.infer<typeof loginSchema>;
