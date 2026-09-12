import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

const menuItemSchema = z.object({
  name: z.string().min(2, 'Item name must have at least 2 characters'),
  description: z.string().min(5, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  image: z.string().url('Image must be a valid URL'),
  categoryId: z.string().min(1, 'Category is required'),
  isAvailable: z.boolean().default(true),
  preparationTime: z.number().int().positive().default(15),
  isVeg: z.boolean().default(true),
  isSpicy: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const getMenu = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, veg, available, popular, featured } = req.query;

    const whereClause: any = {};

    if (category && typeof category === 'string' && category !== 'all') {
      whereClause.OR = [
        { categoryId: category },
        { category: { slug: category.toLowerCase() } },
        { category: { name: { equals: category, mode: 'insensitive' } } },
      ];
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      whereClause.AND = [
        ...(whereClause.AND || []),
        {
          OR: [
            { name: { contains: search.trim(), mode: 'insensitive' } },
            { description: { contains: search.trim(), mode: 'insensitive' } },
          ],
        },
      ];
    }

    if (veg !== undefined) {
      whereClause.isVeg = veg === 'true';
    }

    if (available !== undefined) {
      whereClause.isAvailable = available === 'true';
    }

    if (popular !== undefined) {
      whereClause.isPopular = popular === 'true';
    }

    if (featured !== undefined) {
      whereClause.isFeatured = featured === 'true';
    }

    const items = await prisma.menuItem.findMany({
      where: whereClause,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ isPopular: 'desc' }, { createdAt: 'desc' }],
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve menu items' });
  }
};

export const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    // Also fetch 3 related items from same category
    const related = await prisma.menuItem.findMany({
      where: {
        categoryId: item.categoryId,
        id: { not: item.id },
        isAvailable: true,
      },
      take: 3,
    });

    res.status(200).json({
      success: true,
      data: {
        ...item,
        related,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch menu item details' });
  }
};

export const createMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = menuItemSchema.parse({
      ...req.body,
      price: Number(req.body.price),
      preparationTime: Number(req.body.preparationTime || 15),
    });

    const category = await prisma.category.findUnique({
      where: { id: validatedData.categoryId },
    });

    if (!category) {
      res.status(400).json({ success: false, message: 'Selected category does not exist' });
      return;
    }

    const newItem = await prisma.menuItem.create({
      data: validatedData,
      include: { category: true },
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: newItem,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, message: error.errors[0].message });
      return;
    }
    console.error('Error creating menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to create menu item' });
  }
};

export const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    const updateData: any = { ...req.body };
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.preparationTime !== undefined) updateData.preparationTime = Number(updateData.preparationTime);

    const updated = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to update menu item' });
  }
};

export const deleteMenuItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.menuItem.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    await prisma.menuItem.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete menu item' });
  }
};

export const toggleAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await prisma.menuItem.findUnique({ where: { id } });

    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !item.isAvailable },
    });

    res.status(200).json({
      success: true,
      message: `Menu item marked as ${updated.isAvailable ? 'available' : 'unavailable'}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle availability' });
  }
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { menuItems: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, description, image, orderIndex } = req.body;
    if (!name || !slug) {
      res.status(400).json({ success: false, message: 'Name and slug are required' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description,
        image,
        orderIndex: orderIndex ? Number(orderIndex) : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, orderIndex } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug: slug.toLowerCase().replace(/\s+/g, '-') }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(orderIndex !== undefined && { orderIndex: Number(orderIndex) }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete category' });
  }
};

