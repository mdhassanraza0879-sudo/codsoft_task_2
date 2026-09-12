import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  createReservation,
  getAllReservations,
  getMyReservations,
  updateReservationStatus,
} from '../controllers/reservationController';
import { authenticateToken, optionalAuth, requireRole } from '../middleware/auth';

const router = Router();

// Create reservation
router.post('/', optionalAuth, createReservation);

// Customer personal reservations
router.get('/my-reservations', authenticateToken, getMyReservations);

// Staff & Admin view all reservations
router.get(
  '/',
  authenticateToken,
  requireRole([Role.STAFF, Role.ADMIN]),
  getAllReservations
);

// Staff & Admin update status
router.put(
  '/:id/status',
  authenticateToken,
  requireRole([Role.STAFF, Role.ADMIN]),
  updateReservationStatus
);

export default router;
