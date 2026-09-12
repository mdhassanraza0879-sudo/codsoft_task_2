import { Request, Response } from 'express';
import { z } from 'zod';
import { ReservationStatus } from '@prisma/client';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

const createReservationSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(6, 'Valid phone number is required'),
  date: z.string().min(8, 'Date is required (YYYY-MM-DD)'),
  time: z.string().min(4, 'Time is required'),
  guests: z.number().int().min(1, 'Must have at least 1 guest').max(20, 'Maximum 20 guests online'),
  specialRequest: z.string().optional(),
});

export const createReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createReservationSchema.parse({
      ...req.body,
      guests: Number(req.body.guests),
    });

    const reservation = await prisma.reservation.create({
      data: {
        customerId: req.user ? req.user.id : null,
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail.toLowerCase(),
        customerPhone: validatedData.customerPhone,
        date: validatedData.date,
        time: validatedData.time,
        guests: validatedData.guests,
        specialRequest: validatedData.specialRequest || null,
        status: ReservationStatus.PENDING,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Table reservation submitted successfully! We look forward to hosting you.',
      data: reservation,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: error.errors[0].message });
      return;
    }
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, message: 'Failed to create reservation' });
  }
};

export const getAllReservations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, date } = req.query;

    const whereClause: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status as ReservationStatus;
    }
    if (date && typeof date === 'string') {
      whereClause.date = date;
    }

    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      orderBy: [{ date: 'desc' }, { time: 'asc' }],
    });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reservations' });
  }
};

export const getMyReservations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        OR: [
          { customerId: req.user.id },
          { customerEmail: req.user.email },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve your reservations' });
  }
};

export const updateReservationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(ReservationStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${Object.values(ReservationStatus).join(', ')}`,
      });
      return;
    }

    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      res.status(404).json({ success: false, message: 'Reservation not found' });
      return;
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status: status as ReservationStatus },
    });

    res.status(200).json({
      success: true,
      message: `Reservation status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update reservation status' });
  }
};
