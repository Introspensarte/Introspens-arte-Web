import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertActivitySchema,
  insertNewsSchema,
  insertAnnouncementSchema,
  insertActivityToDoSchema,
  loginSchema 
} from "@shared/schema";
import { calculateTraces } from "../client/src/lib/trace-calculator";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if signature already exists
      const existingUser = await storage.getUserBySignature(userData.signature);
      if (existingUser) {
        return res.status(400).json({ message: "Signature already exists" });
      }

      const user = await storage.createUser(userData);
      res.status(201).json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User login
  app.post("/api/login", async (req, res) => {
    try {
      const { signature } = loginSchema.parse(req.body);
      const user = await storage.getUserBySignature(signature);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid signature" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create activity
  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const userId = parseInt(req.body.userId);
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Calculate traces based on activity type
      const traces = calculateTraces(
        activityData.type, 
        activityData.words, 
        activityData.comments || 0
      );

      const activity = await storage.createActivity({
        ...activityData,
        userId,
        traces
      });

      res.status(201).json({ activity });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get user activities
  app.get("/api/users/:id/activities", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const activities = await storage.getUserActivities(userId);
      res.json({ activities });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get rankings
  app.get("/api/rankings/:type", async (req, res) => {
    try {
      const type = req.params.type as 'traces' | 'words';
      if (type !== 'traces' && type !== 'words') {
        return res.status(400).json({ message: "Invalid ranking type" });
      }

      const rankings = await storage.getUserRankings(type);
      res.json({ rankings });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // News endpoints
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json({ news });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const authorId = parseInt(req.body.authorId);
      
      if (!authorId) {
        return res.status(400).json({ message: "Author ID is required" });
      }

      // Check if user is admin
      const user = await storage.getUser(authorId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const news = await storage.createNews({
        ...newsData,
        authorId
      });

      res.status(201).json({ news });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Announcements endpoints
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json({ announcements });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const announcementData = insertAnnouncementSchema.parse(req.body);
      const authorId = parseInt(req.body.authorId);
      
      if (!authorId) {
        return res.status(400).json({ message: "Author ID is required" });
      }

      // Check if user is admin
      const user = await storage.getUser(authorId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const announcement = await storage.createAnnouncement({
        ...announcementData,
        authorId
      });

      res.status(201).json({ announcement });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Activities to do endpoints
  app.get("/api/activities-to-do", async (req, res) => {
    try {
      const activitiesToDo = await storage.getAllActivitiesToDo();
      res.json({ activitiesToDo });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/activities-to-do", async (req, res) => {
    try {
      const activityToDoData = insertActivityToDoSchema.parse(req.body);
      const authorId = parseInt(req.body.authorId);
      
      if (!authorId) {
        return res.status(400).json({ message: "Author ID is required" });
      }

      // Check if user is admin
      const user = await storage.getUser(authorId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const activityToDo = await storage.createActivityToDo({
        ...activityToDoData,
        authorId
      });

      res.status(201).json({ activityToDo });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin management
  app.post("/api/admin/make-admin", async (req, res) => {
    try {
      const { userId, adminId } = req.body;
      
      // Check if requester is #INELUDIBLE
      const admin = await storage.getUser(adminId);
      if (admin?.signature !== "#INELUDIBLE") {
        return res.status(403).json({ message: "Only #INELUDIBLE can assign admin roles" });
      }

      await storage.makeUserAdmin(userId);
      res.json({ message: "User promoted to admin" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/remove-admin", async (req, res) => {
    try {
      const { userId, adminId } = req.body;
      
      // Check if requester is #INELUDIBLE
      const admin = await storage.getUser(adminId);
      if (admin?.signature !== "#INELUDIBLE") {
        return res.status(403).json({ message: "Only #INELUDIBLE can remove admin roles" });
      }

      // Prevent removing #INELUDIBLE's admin status
      const targetUser = await storage.getUser(userId);
      if (targetUser?.signature === "#INELUDIBLE") {
        return res.status(400).json({ message: "Cannot remove admin status from #INELUDIBLE" });
      }

      await storage.removeUserAdmin(userId);
      res.json({ message: "Admin privileges removed" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
