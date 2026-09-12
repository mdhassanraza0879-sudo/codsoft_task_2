import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticateToken, optionalAuth, requireRole } from '../middleware/auth';

const router = Router();

// Place new order (supports guest and logged-in user)
router.post('/', optionalAuth, createOrder);

// Customer personal orders
router.get('/my-orders', authenticateToken, getMyOrders);

// Staff & Admin view all orders
router.get(
  '/',
  authenticateToken,
  requireRole([Role.STAFF, Role.ADMIN]),
  getAllOrders
);

// View order by ID or Order Number (for tracking)
router.get('/:id', getOrderById);

// Staff & Admin update order status
router.put(
  '/:id/status',
  authenticateToken,
  requireRole([Role.STAFF, Role.ADMIN]),
  updateOrderStatus
);

export default router;
