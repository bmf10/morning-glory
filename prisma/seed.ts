import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.category.createMany({
    data: [
      {
        code: 'FOOD',
        name: 'Food',
        description: 'All food items',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'DRINK',
        name: 'Drink',
        description: 'All drink items',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  const foodCategory = await prisma.category.findUnique({ where: { code: 'FOOD' } });
  const drinkCategory = await prisma.category.findUnique({ where: { code: 'DRINK' } });

  const productsData = [
    {
      code: 'APPLE',
      name: 'Apple',
      categoryId: foodCategory?.id ?? 1,
      unit: 'pcs',
      inStock: true,
      description: 'Fresh red apples, hand-picked and perfect for snacking or baking. Crisp and juicy with a sweet flavor.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'WATER',
      name: 'Water Bottle',
      categoryId: drinkCategory?.id ?? 2,
      unit: 'bottle',
      inStock: true,
      description: 'Bottled mineral water sourced from natural springs, ideal for hydration on the go or at home.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'BANANA',
      name: 'Banana',
      categoryId: foodCategory?.id ?? 1,
      unit: 'pcs',
      inStock: true,
      description: 'Ripe yellow bananas, rich in potassium and perfect for a healthy snack or smoothie ingredient.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'BREAD',
      name: 'Bread',
      categoryId: foodCategory?.id ?? 1,
      unit: 'loaf',
      inStock: true,
      description: 'Freshly baked bread loaf with a soft interior and golden crust, great for sandwiches or toast.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'MILK',
      name: 'Milk',
      categoryId: drinkCategory?.id ?? 2,
      unit: 'liter',
      inStock: true,
      description: 'Whole cow milk, rich in calcium and nutrients, suitable for drinking, cooking, or baking.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'ORANGE',
      name: 'Orange',
      categoryId: foodCategory?.id ?? 1,
      unit: 'pcs',
      inStock: true,
      description: 'Juicy oranges packed with vitamin C, perfect for juicing, snacking, or adding to salads.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'COFFEE',
      name: 'Coffee',
      categoryId: drinkCategory?.id ?? 2,
      unit: 'cup',
      inStock: true,
      description: 'Hot brewed coffee made from premium roasted beans, offering a rich aroma and bold flavor to start your day.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'TEA',
      name: 'Tea',
      categoryId: drinkCategory?.id ?? 2,
      unit: 'cup',
      inStock: true,
      description: 'Freshly brewed tea, soothing and aromatic, available in a variety of flavors for any time of day.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'EGG',
      name: 'Egg',
      categoryId: foodCategory?.id ?? 1,
      unit: 'pcs',
      inStock: true,
      description: 'Farm fresh eggs, high in protein and versatile for breakfast, baking, or cooking.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'CHEESE',
      name: 'Cheese',
      categoryId: foodCategory?.id ?? 1,
      unit: 'block',
      inStock: true,
      description: 'Block of cheddar cheese, aged for a sharp flavor, perfect for slicing, melting, or grating over dishes.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'JUICE',
      name: 'Juice',
      categoryId: drinkCategory?.id ?? 2,
      unit: 'bottle',
      inStock: true,
      description: 'Mixed fruit juice, a refreshing blend of natural fruits with no added sugar, great for any occasion.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'RICE',
      name: 'Rice',
      categoryId: foodCategory?.id ?? 1,
      unit: 'kg',
      inStock: true,
      description: 'White rice, a staple grain that is fluffy and light when cooked, suitable for a variety of cuisines.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'PASTA',
      name: 'Pasta',
      categoryId: foodCategory?.id ?? 1,
      unit: 'pack',
      inStock: true,
      description: 'Packaged pasta made from durum wheat, ideal for classic Italian dishes and quick meals.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'SODA',
      name: 'Soda',
      categoryId: drinkCategory?.id ?? 2,
      unit: 'can',
      inStock: true,
      description: 'Carbonated soft drink, sweet and fizzy, perfect for parties, gatherings, or a refreshing treat.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: 'YOGURT',
      name: 'Yogurt',
      categoryId: foodCategory?.id ?? 1,
      unit: 'cup',
      inStock: true,
      description: 'Plain yogurt cup, creamy and tangy, rich in probiotics and great for breakfast or snacks.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const products = await prisma.product.createMany({
    data: productsData,
  });

  const productCodes = [
    'APPLE', 'WATER', 'BANANA', 'BREAD', 'MILK', 'ORANGE', 'COFFEE', 'TEA',
    'EGG', 'CHEESE', 'JUICE', 'RICE', 'PASTA', 'SODA', 'YOGURT'
  ];
  const productRecords: { id: number; code: string }[] = await prisma.product.findMany({
    where: { code: { in: productCodes } },
    select: { id: true, code: true }
  });
  const productMap: Record<string, number> = {};
  productRecords.forEach(p => { if (p.code) productMap[p.code] = p.id; });

  await prisma.stock.createMany({
    data: [
      {
        productId: productMap['APPLE'] ?? 1,
        amount: 100,
        unit: 'pcs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['WATER'] ?? 2,
        amount: 50,
        unit: 'bottle',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['BANANA'] ?? 3,
        amount: 120,
        unit: 'pcs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['BREAD'] ?? 4,
        amount: 40,
        unit: 'loaf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['MILK'] ?? 5,
        amount: 60,
        unit: 'liter',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['ORANGE'] ?? 6,
        amount: 90,
        unit: 'pcs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['COFFEE'] ?? 7,
        amount: 80,
        unit: 'cup',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['TEA'] ?? 8,
        amount: 70,
        unit: 'cup',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['EGG'] ?? 9,
        amount: 200,
        unit: 'pcs',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['CHEESE'] ?? 10,
        amount: 30,
        unit: 'block',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['JUICE'] ?? 11,
        amount: 55,
        unit: 'bottle',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['RICE'] ?? 12,
        amount: 100,
        unit: 'kg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['PASTA'] ?? 13,
        amount: 75,
        unit: 'pack',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['SODA'] ?? 14,
        amount: 90,
        unit: 'can',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: productMap['YOGURT'] ?? 15,
        amount: 60,
        unit: 'cup',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });
  console.log('✅ Seeder completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
