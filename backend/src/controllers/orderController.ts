import { Request, Response } from 'express';
import { z } from 'zod';
import { OrderStatus, PaymentMethod, PaymentStatus, Role } from '@prisma/client';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/auth';

const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(6, 'Valid phone number is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  orderType: z.enum(['DELIVERY', 'DINE_IN']).default('DELIVERY'),
  paymentMethod: z.enum(['CARD', 'UPI', 'CASH']).default('CARD'),
  specialInstructions: z.string().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1, 'Item ID required'),
        quantity: z.number().int().positive('Quantity must be at least 1'),
      })
    )
    .min(1, 'Order must contain at least 1 item'),
});

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = createOrderSchema.parse(req.body);

    // Fetch items from DB to calculate genuine prices & ensure availability
    const itemIds = validatedData.items.map((i) => i.menuItemId);
    const dbItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
    });

    if (dbItems.length !== itemIds.length) {
      res.status(400).json({ success: false, message: 'One or more items in the order do not exist' });
      return;
    }

    // Check availability
    const unavailable = dbItems.filter((i) => !i.isAvailable);
    if (unavailable.length > 0) {
      res.status(400).json({
        success: false,
        message: `Item "${unavailable[0].name}" is currently sold out.`,
      });
      return;
    }

    const itemPriceMap = new Map(dbItems.map((i) => [i.id, i.price]));

    let subtotal = 0;
    const orderItemsToCreate = validatedData.items.map((item) => {
      const price = itemPriceMap.get(item.menuItemId) || 0;
      const totalItemPrice = parseFloat((price * item.quantity).toFixed(2));
      subtotal += totalItemPrice;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: price,
        totalPrice: totalItemPrice,
      };
    });

    subtotal = parseFloat(subtotal.toFixed(2));
    const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% standard tax
    const deliveryFee = validatedData.orderType === 'DELIVERY' ? 2.99 : 0;
    const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

    // Unique order number e.g. DD-2026-8742
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `DD-${new Date().getFullYear()}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: req.user ? req.user.id : null,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        deliveryAddress: validatedData.deliveryAddress,
        orderType: validatedData.orderType,
        subtotal,
        tax,
        deliveryFee,
        total,
        paymentStatus: validatedData.paymentMethod === 'CASH' ? PaymentStatus.PENDING : PaymentStatus.PAID,
        paymentMethod: validatedData.paymentMethod as PaymentMethod,
        orderStatus: OrderStatus.PENDING,
        specialInstructions: validatedData.specialInstructions || null,
        items: {
          create: orderItemsToCreate,
        },
      },
      include: {
        items: {
          include: {
            menuItem: {
              select: { id: true, name: true, image: true, price: true },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: error.errors[0].message });
      return;
    }
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, limit = '50' } = req.query;

    const whereClause: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.orderStatus = status as OrderStatus;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            menuItem: {
              select: { id: true, name: true, image: true },
            },
          },
        },
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: {
        items: {
          include: {
            menuItem: {
              select: { id: true, name: true, image: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve personal orders' });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Search by ID or orderNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${Object.values(OrderStatus).join(', ')}`,
      });
      return;
    }

    const existing = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: {
        orderStatus: status as OrderStatus,
        paymentStatus: status === 'DELIVERED' && existing.paymentMethod === 'CASH' ? 'PAID' : existing.paymentStatus,
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
};
