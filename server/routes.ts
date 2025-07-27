import { Request, Response, Router } from 'express';
import { storage } from './storage';
import { insertRKASActivitySchema, insertRKASBudgetItemSchema, insertUserPreferenceSchema } from '@shared/schema';
import { z } from 'zod';

const router = Router();

// RKAS Activities routes
router.get('/api/activities', async (req: Request, res: Response) => {
  try {
    const activities = await storage.getActivities();
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

router.post('/api/activities', async (req: Request, res: Response) => {
  try {
    const validatedData = insertRKASActivitySchema.parse(req.body);
    const activity = await storage.createActivity(validatedData);
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create activity' });
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
    res.status(500).json({ error: 'Failed to fetch budget items' });
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