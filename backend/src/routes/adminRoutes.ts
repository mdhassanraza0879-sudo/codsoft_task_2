import { Router } from 'express';
import { Role } from '@prisma/client';
import { getDashboardStats, getAllUsers, updateUserRole } from '../controllers/adminController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get(
  '/stats',
  authenticateToken,
  requireRole([Role.ADMIN]),
  getDashboardStats
);

router.get(
  '/users',
  authenticateToken,
  requireRole([Role.ADMIN]),
  getAllUsers
);

router.patch(
  '/users/:id/role',
  authenticateToken,
  requireRole([Role.ADMIN]),
  updateUserRole
);

export default router;

