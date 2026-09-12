import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // Password hashing
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const staffPassword = await bcrypt.hash('staff123', salt);
  const customerPassword = await bcrypt.hash('customer123', salt);

  // 1. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Restaurant Admin',
      email: 'admin@dinedesk.com',
      password: adminPassword,
      role: Role.ADMIN,
      phone: '+1 (555) 100-2001',
    },
  });

  const staff = await prisma.user.create({
    data: {
      name: 'Chef Gordon (Staff)',
      email: 'staff@dinedesk.com',
      password: staffPassword,
      role: Role.STAFF,
      phone: '+1 (555) 200-3002',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'customer@dinedesk.com',
      password: customerPassword,
      role: Role.CUSTOMER,
      phone: '+1 (555) 300-4003',
    },
  });

  console.log(`👤 Created users: Admin (${admin.email}), Staff (${staff.email}), Customer (${customer.email})`);

  // 2. Create Categories
  const categoriesData = [
    {
      name: 'Starters',
      slug: 'starters',
      description: 'Crispy, flavorful appetizers to kickstart your meal',
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
      orderIndex: 1,
    },
    {
      name: 'Main Course',
      slug: 'main-course',
      description: 'Hearty chef-crafted signature curries, sizzlers, and entrees',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      orderIndex: 2,
    },
    {
      name: 'Biryani',
      slug: 'biryani',
      description: 'Aromatic basmati rice slow-cooked with saffron and royal spices',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      orderIndex: 3,
    },
    {
      name: 'Pizza',
      slug: 'pizza',
      description: 'Wood-fired sourdough crusts with bubbling artisan mozzarella',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      orderIndex: 4,
    },
    {
      name: 'Burgers',
      slug: 'burgers',
      description: 'Smash-grilled gourmet patties nestled in toasted brioche buns',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      orderIndex: 5,
    },
    {
      name: 'Desserts',
      slug: 'desserts',
      description: 'Decadent sweet endings crafted with Belgian chocolate and fresh cream',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
      orderIndex: 6,
    },
    {
      name: 'Beverages',
      slug: 'beverages',
      description: 'Refreshing artisan mocktails, pressed elixirs, and brewed coffee',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      orderIndex: 7,
    },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({ data: cat });
    categoriesMap[cat.slug] = createdCat.id;
  }
  console.log(`📂 Created ${categoriesData.length} food categories.`);

  // 3. Create Menu Items (18 items across all 7 categories)
  const menuItemsData = [
    // Starters
    {
      name: 'Crispy Truffle Parmesan Fries',
      description: 'Hand-cut russet potatoes tossed in white truffle oil, sea salt, aged parmesan, and fresh rosemary with garlic aioli.',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['starters'],
      isAvailable: true,
      preparationTime: 12,
      isVeg: true,
      isSpicy: false,
      isPopular: true,
      isFeatured: false,
    },
    {
      name: 'Paneer Tikka Charcoal Skewers',
      description: 'Cottage cheese cubes marinated in tandoori yogurt, Kashmiri chili, and carom seeds, charred to perfection.',
      price: 11.49,
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['starters'],
      isAvailable: true,
      preparationTime: 18,
      isVeg: true,
      isSpicy: true,
      isPopular: true,
      isFeatured: true,
    },
    {
      name: 'Honey Glazed Buffalo Wings',
      description: 'Double-crisped chicken wings tossed in smoked honey chipotle sauce, served with cool ranch and celery sticks.',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1527477378308-1e024f33da77?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['starters'],
      isAvailable: true,
      preparationTime: 15,
      isVeg: false,
      isSpicy: true,
      isPopular: true,
      isFeatured: false,
    },

    // Main Course
    {
      name: 'Butter Chicken Grand Royale',
      description: 'Charred chicken tikka simmered in a velvety, buttery tomato-cashew cream gravy infused with dried fenugreek leaves.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['main-course'],
      isAvailable: true,
      preparationTime: 22,
      isVeg: false,
      isSpicy: false,
      isPopular: true,
      isFeatured: true,
    },
    {
      name: 'Paneer Butter Masala',
      description: 'Soft cottage cheese cubes in an indulgent makhani gravy delicately flavored with crushed cardamom and butter.',
      price: 14.49,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['main-course'],
      isAvailable: true,
      preparationTime: 18,
      isVeg: true,
      isSpicy: false,
      isPopular: true,
      isFeatured: false,
    },
    {
      name: 'Pan-Seared Salmon Steak',
      description: 'Fresh Atlantic salmon fillet seared with dill butter, accompanied by roasted asparagus and creamy mashed potatoes.',
      price: 21.99,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['main-course'],
      isAvailable: true,
      preparationTime: 25,
      isVeg: false,
      isSpicy: false,
      isPopular: false,
      isFeatured: true,
    },

    // Biryani
    {
      name: 'Hyderabadi Dum Chicken Biryani',
      description: 'Long-grain basmati rice and marinated chicken cooked on slow steam (Dum) with saffron, mint, and fried onions. Served with Mirchi Ka Salan and Raita.',
      price: 17.99,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['biryani'],
      isAvailable: true,
      preparationTime: 25,
      isVeg: false,
      isSpicy: true,
      isPopular: true,
      isFeatured: true,
    },
    {
      name: 'Royal Shahi Veg Biryani',
      description: 'Garden fresh vegetables, paneer cubes, and basmati rice layered with aromatic spices and saffron water.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['biryani'],
      isAvailable: true,
      preparationTime: 20,
      isVeg: true,
      isSpicy: false,
      isPopular: false,
      isFeatured: false,
    },

    // Pizza
    {
      name: 'Margherita Burrata Pizza',
      description: 'San Marzano tomato base, artisanal whole burrata, fresh sweet basil leaves, and cold-pressed extra virgin olive oil.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['pizza'],
      isAvailable: true,
      preparationTime: 16,
      isVeg: true,
      isSpicy: false,
      isPopular: true,
      isFeatured: true,
    },
    {
      name: 'Spicy Pepperoni & Hot Honey Pizza',
      description: 'Crispy beef pepperoni cups, mozzarella, crushed red pepper flakes, drizzled with hot chili-infused blossom honey.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['pizza'],
      isAvailable: true,
      preparationTime: 18,
      isVeg: false,
      isSpicy: true,
      isPopular: true,
      isFeatured: false,
    },
    {
      name: 'Wild Forest Truffle Mushroom Pizza',
      description: 'Roasted portobello and button mushrooms, caramelized onions, fontina cheese, and black truffle drizzle.',
      price: 17.49,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['pizza'],
      isAvailable: true,
      preparationTime: 18,
      isVeg: true,
      isSpicy: false,
      isPopular: false,
      isFeatured: false,
    },

    // Burgers
    {
      name: 'Classic Double Smash Cheeseburger',
      description: 'Twin beef smash patties, melted aged cheddar, house pickle relish, crispy iceberg, and secret burger sauce on brioche.',
      price: 13.49,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['burgers'],
      isAvailable: true,
      preparationTime: 14,
      isVeg: false,
      isSpicy: false,
      isPopular: true,
      isFeatured: true,
    },
    {
      name: 'Crispy Korean Fried Chicken Burger',
      description: 'Panko fried chicken breast glazed with gochujang sweet heat, Asian slaw, and spicy mayo on sesame brioche.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['burgers'],
      isAvailable: true,
      preparationTime: 15,
      isVeg: false,
      isSpicy: true,
      isPopular: true,
      isFeatured: false,
    },
    {
      name: 'Avocado & Black Bean Burger',
      description: 'Hearty roasted black bean and quinoa patty, smashed avocado, pico de gallo, and chipotle lime crema.',
      price: 12.49,
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['burgers'],
      isAvailable: true,
      preparationTime: 14,
      isVeg: true,
      isSpicy: false,
      isPopular: false,
      isFeatured: false,
    },

    // Desserts
    {
      name: 'Molten Belgian Chocolate Lava Cake',
      description: 'Warm chocolate cake with a rich liquid ganache center, served with vanilla bean gelato and fresh raspberries.',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['desserts'],
      isAvailable: true,
      preparationTime: 10,
      isVeg: true,
      isSpicy: false,
      isPopular: true,
      isFeatured: true,
    },
    {
      name: 'New York Baked Cheesecake',
      description: 'Silky smooth classic cream cheese filling on a buttery graham cracker crust with house strawberry compote.',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['desserts'],
      isAvailable: true,
      preparationTime: 5,
      isVeg: true,
      isSpicy: false,
      isPopular: false,
      isFeatured: false,
    },

    // Beverages
    {
      name: 'Passion Fruit Mango Mojito',
      description: 'Fresh mint leaves, passion fruit pulp, crushed ice, lime juice, and sparkling soda with a sugared rim.',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['beverages'],
      isAvailable: true,
      preparationTime: 6,
      isVeg: true,
      isSpicy: false,
      isPopular: true,
      isFeatured: true,
    },
    {
      name: 'Iced Caramel Macchiato',
      description: 'Double espresso shot poured over cold milk and vanilla syrup, drizzled with homemade buttery caramel sauce.',
      price: 5.49,
      image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['beverages'],
      isAvailable: true,
      preparationTime: 5,
      isVeg: true,
      isSpicy: false,
      isPopular: false,
      isFeatured: false,
    },
    {
      name: 'Smoked Garlic Hummus & Warm Zaatar Pita',
      description: 'Velvety roasted garlic chickpea puree, extra virgin kalamata olive oil, toasted pine nuts, served with fresh hearth pita.',
      price: 9.49,
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['starters'],
      isAvailable: true,
      preparationTime: 10,
      isVeg: true,
      isSpicy: false,
      isPopular: true,
      isFeatured: false,
    },
    {
      name: 'Slow-Braised Kashmiri Mutton Rogan Josh',
      description: 'Tender lamb shanks simmered in caramelized brown onions, Kashmiri dried red chilies, fennel powder, and rich bone marrow jus.',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['main-course'],
      isAvailable: true,
      preparationTime: 25,
      isVeg: false,
      isSpicy: true,
      isPopular: true,
      isFeatured: true,
    },
    {
      name: 'Awadhi Mutton Dum Biryani',
      description: 'Royal Lucknowi style goat meat marinated in cardamom, mace, and royal saffron, dum cooked with premium aged basmati rice.',
      price: 19.49,
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['biryani'],
      isAvailable: true,
      preparationTime: 25,
      isVeg: false,
      isSpicy: true,
      isPopular: true,
      isFeatured: true,
    },
    {
      name: 'Saffron Pistachio Rasmalai Delight',
      description: 'Soft cottage cheese patties soaked in saffron-infused thickened sweet milk, garnished with Iranian pistachios and edible gold leaf.',
      price: 7.49,
      image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['desserts'],
      isAvailable: true,
      preparationTime: 5,
      isVeg: true,
      isSpicy: false,
      isPopular: true,
      isFeatured: false,
    },
    {
      name: 'Sparkling Hibiscus Berry Cooler',
      description: 'Chilled steeped Egyptian hibiscus blossom tea, crushed wild berries, fresh lemon, agave nectar, and sparkling spring water.',
      price: 5.29,
      image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
      categoryId: categoriesMap['beverages'],
      isAvailable: true,
      preparationTime: 5,
      isVeg: true,
      isSpicy: false,
      isPopular: false,
      isFeatured: false,
    },
  ];

  for (const item of menuItemsData) {
    await prisma.menuItem.create({ data: item });
  }
  console.log(`🍽️ Seeded ${menuItemsData.length} menu items.`);

  // 4. Create sample initial orders for demonstration
  const createdItems = await prisma.menuItem.findMany();
  if (createdItems.length >= 2) {
    const item1 = createdItems[0];
    const item2 = createdItems[1];

    const orderSubtotal = item1.price * 2 + item2.price * 1;
    const tax = parseFloat((orderSubtotal * 0.05).toFixed(2));
    const total = parseFloat((orderSubtotal + tax + 2.99).toFixed(2));

    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber: 'DD-2026-1001',
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone || '+1 (555) 300-4003',
        deliveryAddress: '42 Baker Street, Apt 4B, Food City',
        orderType: 'DELIVERY',
        subtotal: orderSubtotal,
        tax: tax,
        deliveryFee: 2.99,
        total: total,
        paymentStatus: 'PAID',
        paymentMethod: 'CARD',
        orderStatus: 'PREPARING',
        specialInstructions: 'Please make it extra crispy and include extra napkins.',
        items: {
          create: [
            {
              menuItemId: item1.id,
              quantity: 2,
              unitPrice: item1.price,
              totalPrice: item1.price * 2,
            },
            {
              menuItemId: item2.id,
              quantity: 1,
              unitPrice: item2.price,
              totalPrice: item2.price * 1,
            },
          ],
        },
      },
    });

    console.log(`📦 Seeded sample order #${sampleOrder.orderNumber} with status PREPARING.`);
  }

  // 5. Create sample reservation
  await prisma.reservation.create({
    data: {
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || '+1 (555) 300-4003',
      date: '2026-09-15',
      time: '19:30',
      guests: 4,
      specialRequest: 'Window booth seat for anniversary dinner.',
      status: 'CONFIRMED',
    },
  });

  console.log('🍷 Seeded sample confirmed table reservation.');
  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
