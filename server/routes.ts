import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertRkasActivitySchema, insertFileSchema } from "@shared/schema";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Multer configuration for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});

// Middleware to verify JWT token
const authenticateToken = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await storage.verifyPassword(user, password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
      
      // Update last login
      await storage.updateUser(user.id, { lastLogin: new Date() });

      // Log audit
      await storage.createAuditLog({
        userId: user.id,
        action: "login",
        entityType: "user",
        entityId: user.id,
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          schoolName: user.schoolName,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", authenticateToken, (req: Request, res: Response) => {
    const user = req.user;
    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      schoolName: user.schoolName,
    });
  });

  // User management routes
  app.get("/api/users", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "super_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const users = await storage.getAllUsers();
      res.json(users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        schoolName: user.schoolName,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      })));
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "super_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);

      // Log audit
      await storage.createAuditLog({
        userId: req.user.id,
        action: "create_user",
        entityType: "user",
        entityId: user.id,
        newData: JSON.stringify(userData),
      });

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        schoolName: user.schoolName,
        isActive: user.isActive,
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // RKAS routes
  app.get("/api/rkas/fields", authenticateToken, async (req: Request, res: Response) => {
    try {
      const fields = await storage.getAllFields();
      res.json(fields);
    } catch (error) {
      console.error("Get fields error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/rkas/activities", authenticateToken, async (req: Request, res: Response) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/rkas/activities", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (req.user.role === "viewer") {
        return res.status(403).json({ message: "Access denied" });
      }

      const activityData = insertRkasActivitySchema.parse({
        ...req.body,
        createdBy: req.user.id,
      });
      
      const activity = await storage.createActivity(activityData);

      // Log audit
      await storage.createAuditLog({
        userId: req.user.id,
        action: "create_activity",
        entityType: "activity",
        entityId: activity.id,
        newData: JSON.stringify(activityData),
      });

      res.status(201).json(activity);
    } catch (error) {
      console.error("Create activity error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/rkas/activities/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (req.user.role === "viewer") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { id } = req.params;
      const updates = req.body;
      
      const activity = await storage.updateActivity(id, updates);

      // Log audit
      await storage.createAuditLog({
        userId: req.user.id,
        action: "update_activity",
        entityType: "activity",
        entityId: id,
        newData: JSON.stringify(updates),
      });

      res.json(activity);
    } catch (error) {
      console.error("Update activity error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/rkas/activities/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "super_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { id } = req.params;
      await storage.deleteActivity(id);

      // Log audit
      await storage.createAuditLog({
        userId: req.user.id,
        action: "delete_activity",
        entityType: "activity",
        entityId: id,
      });

      res.status(204).send();
    } catch (error) {
      console.error("Delete activity error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // File management routes
  app.get("/api/files", authenticateToken, async (req: Request, res: Response) => {
    try {
      const files = await storage.getAllFiles();
      res.json(files);
    } catch (error) {
      console.error("Get files error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/files/upload", authenticateToken, upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileType = path.extname(req.file.originalname).toLowerCase().substring(1);
      const fileData = insertFileSchema.parse({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        fileType: fileType as any,
        filePath: req.file.path,
        category: req.body.category || "document",
        activityId: req.body.activityId || null,
        uploadedBy: req.user.id,
      });

      const file = await storage.createFile(fileData);

      // Log audit
      await storage.createAuditLog({
        userId: req.user.id,
        action: "upload_file",
        entityType: "file",
        entityId: file.id,
        newData: JSON.stringify({ fileName: file.originalName }),
      });

      res.status(201).json(file);
    } catch (error) {
      console.error("Upload file error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/files/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteFile(id);

      // Log audit
      await storage.createAuditLog({
        userId: req.user.id,
        action: "delete_file",
        entityType: "file",
        entityId: id,
      });

      res.status(204).send();
    } catch (error) {
      console.error("Delete file error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", authenticateToken, async (req: Request, res: Response) => {
    try {
      const activities = await storage.getAllActivities();
      const users = await storage.getAllUsers();
      const files = await storage.getAllFiles();

      const totalBudget = activities.reduce((sum, activity) => sum + parseFloat(activity.total), 0);
      const realized = activities.reduce((sum, activity) => sum + parseFloat(activity.realisasi), 0);
      const activeActivities = activities.filter(a => a.status !== "rejected").length;
      const pendingRevisions = activities.filter(a => a.status === "review").length;
      const activeUsers = users.filter(u => u.isActive).length;
      const pendingUsers = users.filter(u => !u.isActive).length;

      res.json({
        budget: {
          total: totalBudget,
          realized: realized,
        },
        activities: {
          active: activeActivities,
          total: activities.length,
        },
        revisions: {
          pending: pendingRevisions,
        },
        users: {
          total: users.length,
          active: activeUsers,
          pending: pendingUsers,
        },
        files: {
          total: files.length,
        }
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Audit logs
  app.get("/api/audit-logs", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (req.user.role !== "super_admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const logs = await storage.getAuditLogs(100);
      res.json(logs);
    } catch (error) {
      console.error("Get audit logs error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Add user property to Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
