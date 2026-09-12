import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  getMenu,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/menuController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/categories', getCategories);
router.get('/', getMenu);
router.get('/:id', getMenuItemById);

// Staff & Admin route
router.patch(
  '/:id/availability',
  authenticateToken,
  requireRole([Role.STAFF, Role.ADMIN]),
  toggleAvailability
);

// Admin only routes
router.post(
  '/',
  authenticateToken,
  requireRole([Role.ADMIN]),
  createMenuItem
);
router.put(
  '/:id',
  authenticateToken,
  requireRole([Role.ADMIN]),
  updateMenuItem
);
router.delete(
  '/:id',
  authenticateToken,
  requireRole([Role.ADMIN]),
  deleteMenuItem
);
router.post(
  '/categories',
  authenticateToken,
  requireRole([Role.ADMIN]),
  createCategory
);
router.put(
  '/categories/:id',
  authenticateToken,
  requireRole([Role.ADMIN]),
  updateCategory
);
router.delete(
  '/categories/:id',
  authenticateToken,
  requireRole([Role.ADMIN]),
  deleteCategory
);

export default router;

