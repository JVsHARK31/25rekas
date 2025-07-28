import { Request, Response, Router } from 'express';
import { storage } from './storage.js';
import { insertRKASActivitySchema, insertRKASBudgetItemSchema, insertUserPreferenceSchema } from '../shared/schema.js';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication routes
router.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Simple hardcoded admin check for now
    if (email === 'admin@rkas.com' && password === '123456') {
      // Generate JWT token
      const token = jwt.sign(
        { userId: 'admin-001', email: 'admin@rkas.com', role: 'super_admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: 'admin-001',
          email: 'admin@rkas.com',
          name: 'Administrator RKAS',
          role: 'super_admin',
          fullName: 'Administrator RKAS'
        }
      });
      return;
    }

    // If not admin, try database lookup
    try {
      const user = await storage.getUserByUsername(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName || user.username,
          role: user.role,
          fullName: user.fullName || user.username
        }
      });
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/api/auth/logout', (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

// RKAS Activities routes
router.get('/api/activities', async (req: Request, res: Response) => {
  try {
    const activities = await storage.getActivities();
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    
    // Return mock data when database is not available
    const mockActivities = [
      {
        id: 'mock-1',
        standard_id: 'd36a22a2-5747-4bab-9c4c-eca7edba751b',
        kode_giat: 'GIAT001',
        nama_giat: 'Kegiatan Pembelajaran Reguler',
        subtitle: 'Pembelajaran semester genap 2025',
        kode_dana: '3.02.01',
        nama_dana: 'BOP Reguler',
        tw1: 25000000,
        tw2: 30000000,
        tw3: 35000000,
        tw4: 40000000,
        total: 130000000,
        realisasi: 45000000,
        status: 'approved',
        created_by: 'd8e1be8f-f3cc-459f-929d-7f8a854c5f39',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-2',
        standard_id: 'd36a22a2-5747-4bab-9c4c-eca7edba751b',
        kode_giat: 'GIAT002',
        nama_giat: 'Kegiatan Ekstrakurikuler',
        subtitle: 'Program pengembangan bakat siswa',
        kode_dana: '3.02.02',
        nama_dana: 'BOP Tambahan',
        tw1: 15000000,
        tw2: 20000000,
        tw3: 25000000,
        tw4: 30000000,
        total: 90000000,
        realisasi: 20000000,
        status: 'draft',
        created_by: 'd8e1be8f-f3cc-459f-929d-7f8a854c5f39',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'mock-3',
        standard_id: 'd36a22a2-5747-4bab-9c4c-eca7edba751b',
        kode_giat: 'GIAT003',
        nama_giat: 'Kegiatan Sarana Prasarana',
        subtitle: 'Pemeliharaan dan pengadaan fasilitas',
        kode_dana: '3.02.03',
        nama_dana: 'Dana Infrastruktur',
        tw1: 50000000,
        tw2: 40000000,
        tw3: 30000000,
        tw4: 20000000,
        total: 140000000,
        realisasi: 75000000,
        status: 'in_progress',
        created_by: 'd8e1be8f-f3cc-459f-929d-7f8a854c5f39',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    console.log('Returning mock activities due to database error');
    res.json(mockActivities);
  }
});

// Alias for backward compatibility
router.get('/api/rkas/activities', async (req: Request, res: Response) => {
  // Redirect to the main activities endpoint
  req.url = '/api/activities';
  return router.handle(req, res);
});

router.post('/api/activities', async (req: Request, res: Response) => {
  try {
    console.log('Received activity data:', req.body);
    
    // Transform form data to match database schema
    const transformedData = {
      standard_id: req.body.standar_id || req.body.standard_id || 'd36a22a2-5747-4bab-9c4c-eca7edba751b',
      kode_giat: req.body.kode_giat,
      nama_giat: req.body.nama_giat,
      subtitle: req.body.subtitle,
      kode_dana: req.body.dana_id || req.body.kode_dana || '3.02.01',
      nama_dana: req.body.nama_dana || 'BOP Reguler',
      tw1: req.body.tw1,
      tw2: req.body.tw2,
      tw3: req.body.tw3,
      tw4: req.body.tw4,
      total: req.body.total || (Number(req.body.tw1) + Number(req.body.tw2) + Number(req.body.tw3) + Number(req.body.tw4)),
      realisasi: 0,
      status: req.body.status || 'draft',
      created_by: 'd8e1be8f-f3cc-459f-929d-7f8a854c5f39'
    };
    
    console.log('Transformed data:', transformedData);
    
    const validatedData = insertRKASActivitySchema.parse(transformedData);
    console.log('Validated data:', validatedData);
    
    const activity = await storage.createActivity(validatedData);
    console.log('Created activity:', activity);
    
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create activity', details: error.message });
    }
  }
});

router.put('/api/activities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = insertRKASActivitySchema.partial().parse(req.body);
    const activity = await storage.updateActivity(id, validatedData);
    res.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update activity' });
    }
  }
});

router.delete('/api/activities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await storage.deleteActivity(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// RKAS Budget Items routes
router.get('/api/budget-items', async (req: Request, res: Response) => {
  try {
    const budgetItems = await storage.getBudgetItems();
    res.json(budgetItems);
  } catch (error) {
    console.error('Error fetching budget items:', error);
    
    // Return mock data when database is not available
    const mockBudgetItems = [
      {
        id: 'budget-mock-1',
        name: 'Anggaran Pembelajaran',
        allocatedBudget: '500000000',
        usedBudget: '250000000',
        remainingBudget: '250000000',
        status: 'on-track',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'budget-mock-2',
        name: 'Anggaran Ekstrakurikuler',
        allocatedBudget: '200000000',
        usedBudget: '80000000',
        remainingBudget: '120000000',
        status: 'under-budget',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'budget-mock-3',
        name: 'Anggaran Sarana Prasarana',
        allocatedBudget: '800000000',
        usedBudget: '780000000',
        remainingBudget: '20000000',
        status: 'over-budget',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    console.log('Returning mock budget items due to database error');
    res.json(mockBudgetItems);
  }
});

router.post('/api/budget-items', async (req: Request, res: Response) => {
  try {
    const validatedData = insertRKASBudgetItemSchema.parse(req.body);
    // Calculate remaining budget
    const remainingBudget = Number(validatedData.allocatedBudget) - Number(validatedData.usedBudget);
    
    // Determine status
    const usagePercentage = (Number(validatedData.usedBudget) / Number(validatedData.allocatedBudget)) * 100;
    let status = 'on-track';
    if (usagePercentage > 95) status = 'over-budget';
    else if (usagePercentage < 50) status = 'under-budget';
    
    const budgetItem = await storage.createBudgetItem({
      ...validatedData,
      remainingBudget: remainingBudget.toString(),
      status
    });
    res.status(201).json(budgetItem);
  } catch (error) {
    console.error('Error creating budget item:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create budget item' });
    }
  }
});

router.put('/api/budget-items/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = insertRKASBudgetItemSchema.partial().parse(req.body);
    
    // Recalculate derived fields if budget values are updated
    if (validatedData.allocatedBudget || validatedData.usedBudget) {
      const currentItem = await storage.getBudgetItem(id);
      if (currentItem) {
        const allocatedBudget = Number(validatedData.allocatedBudget || currentItem.allocatedBudget);
        const usedBudget = Number(validatedData.usedBudget || currentItem.usedBudget);
        
        validatedData.remainingBudget = (allocatedBudget - usedBudget).toString();
        
        const usagePercentage = (usedBudget / allocatedBudget) * 100;
        if (usagePercentage > 95) validatedData.status = 'over-budget';
        else if (usagePercentage < 50) validatedData.status = 'under-budget';
        else validatedData.status = 'on-track';
      }
    }
    
    const budgetItem = await storage.updateBudgetItem(id, validatedData);
    res.json(budgetItem);
  } catch (error) {
    console.error('Error updating budget item:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update budget item' });
    }
  }
});

router.delete('/api/budget-items/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await storage.deleteBudgetItem(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting budget item:', error);
    res.status(500).json({ error: 'Failed to delete budget item' });
  }
});

// Dashboard stats routes
router.get('/api/dashboard/stats', async (req: Request, res: Response) => {
  try {
    // Return mock dashboard stats
    const mockStats = {
      totalActivities: 15,
      approvedActivities: 8,
      pendingActivities: 4,
      rejectedActivities: 3,
      totalBudget: 2500000000,
      usedBudget: 1200000000,
      remainingBudget: 1300000000,
      budgetUtilization: 48,
      monthlySpending: [
        { month: 'Jan', amount: 150000000 },
        { month: 'Feb', amount: 200000000 },
        { month: 'Mar', amount: 180000000 },
        { month: 'Apr', amount: 220000000 },
        { month: 'May', amount: 190000000 },
        { month: 'Jun', amount: 260000000 }
      ],
      categoryBreakdown: [
        { category: 'Pembelajaran', amount: 800000000, percentage: 32 },
        { category: 'Ekstrakurikuler', amount: 400000000, percentage: 16 },
        { category: 'Sarana Prasarana', amount: 900000000, percentage: 36 },
        { category: 'Operasional', amount: 400000000, percentage: 16 }
      ]
    };
    
    res.json(mockStats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Users routes
router.get('/api/users', async (req: Request, res: Response) => {
  try {
    // Return mock user data
    const mockUsers = [
      {
        id: 'user-1',
        username: 'admin',
        email: 'admin@rkas.com',
        fullName: 'Administrator RKAS',
        role: 'super_admin',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
      },
      {
        id: 'user-2',
        username: 'kepala_sekolah',
        email: 'kepsek@rkas.com',
        fullName: 'Kepala Sekolah',
        role: 'kepala_sekolah',
        status: 'active',
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 60).toISOString()
      },
      {
        id: 'user-3',
        username: 'bendahara',
        email: 'bendahara@rkas.com',
        fullName: 'Bendahara Sekolah',
        role: 'bendahara',
        status: 'active',
        lastLogin: new Date(Date.now() - 7200000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 45).toISOString()
      }
    ];
    
    res.json(mockUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/api/users', async (req: Request, res: Response) => {
  try {
    // Mock user creation
    const mockUser = {
      id: `user-${Date.now()}`,
      username: req.body.username,
      email: req.body.email,
      fullName: req.body.fullName,
      role: req.body.role || 'user',
      status: 'active',
      lastLogin: null,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(mockUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Mock user update
    const mockUser = {
      id,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json(mockUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Mock user deletion
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Files routes
router.get('/api/files', async (req: Request, res: Response) => {
  try {
    // Return mock file data since we don't have file storage implemented yet
    const mockFiles = [
      {
        id: 'file-1',
        name: 'RAB_Kegiatan_Pembelajaran.pdf',
        category: 'RAB',
        size: 2048576,
        uploadDate: new Date().toISOString(),
        uploadedBy: 'Administrator RKAS',
        url: '/uploads/rab_kegiatan_pembelajaran.pdf'
      },
      {
        id: 'file-2',
        name: 'TOR_Ekstrakurikuler.docx',
        category: 'TOR',
        size: 1024000,
        uploadDate: new Date(Date.now() - 86400000).toISOString(),
        uploadedBy: 'Administrator RKAS',
        url: '/uploads/tor_ekstrakurikuler.docx'
      },
      {
        id: 'file-3',
        name: 'Proposal_Sarana_Prasarana.pdf',
        category: 'Proposal',
        size: 3072000,
        uploadDate: new Date(Date.now() - 172800000).toISOString(),
        uploadedBy: 'Administrator RKAS',
        url: '/uploads/proposal_sarana_prasarana.pdf'
      }
    ];
    
    res.json(mockFiles);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

router.post('/api/files', async (req: Request, res: Response) => {
  try {
    // Mock file upload response
    const mockFile = {
      id: `file-${Date.now()}`,
      name: req.body.name || 'uploaded_file.pdf',
      category: req.body.category || 'Documentation',
      size: req.body.size || 1024000,
      uploadDate: new Date().toISOString(),
      uploadedBy: 'Administrator RKAS',
      url: `/uploads/${req.body.name || 'uploaded_file.pdf'}`
    };
    
    res.status(201).json(mockFile);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

router.delete('/api/files/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Mock file deletion
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// User Preferences routes
router.get('/api/preferences', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const preferences = await storage.getUserPreferences(userId);
    if (!preferences) {
      // Return default preferences
      return res.json({
        periodType: 'quarterly',
        selectedQuarter: 'TW1',
        selectedMonth: 1,
        selectedYear: 2025,
        lastUsedPage: '/rkas-kegiatan'
      });
    }
    
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

router.post('/api/preferences', async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const preferencesData = { ...req.body, userId };
    const validatedData = insertUserPreferenceSchema.parse(preferencesData);
    const preferences = await storage.saveUserPreferences(validatedData);
    res.json(preferences);
  } catch (error) {
    console.error('Error saving user preferences:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to save preferences' });
    }
  }
});

export default router;