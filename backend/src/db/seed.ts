import { PrismaClient, Variants } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { hashPassword } from '../util/hash';

const prisma = new PrismaClient();

async function hash(p: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(p, salt);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if seeding has already been done
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  });

  if (existingAdmin) {
    console.log("Seeding already completed, skipping...");
    return;
  }

  // ============ USERS ============
  const adminPassword = await hashPassword('Pass123!');
  const sellerPassword = await hashPassword('Pass123!');
  const seller2Password = await hashPassword('Pass123!');
  const customerPassword = await hashPassword('Pass123!');
  const customer2Password = await hashPassword('Pass123!');
  const seller3Password = await hashPassword('Pass123!');
  const customer3Password = await hashPassword('Pass123!');
  const customer4Password = await hashPassword('Pass123!');
  const customer5Password = await hashPassword('Pass123!');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  const sellerUser1 = await prisma.user.upsert({
    where: { email: 'seller1@example.com' },
    update: {},
    create: {
      username: 'Seller One',
      email: 'seller1@example.com',
      password: sellerPassword,
      role: 'SELLER',
      emailVerified: new Date(),
    },
  });

  const sellerUser2 = await prisma.user.upsert({
    where: { email: 'seller2@example.com' },
    update: {},
    create: {
      username: 'Seller Two',
      email: 'seller2@example.com',
      password: seller2Password,
      role: 'SELLER',
      emailVerified: new Date(),
    },
  });

  const customerUser1 = await prisma.user.upsert({
    where: { email: 'customer1@example.com' },
    update: {},
    create: {
      username: 'John Doe',
      email: 'customer1@example.com',
      password: customerPassword,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });

  const customerUser2 = await prisma.user.upsert({
    where: { email: 'customer2@example.com' },
    update: {},
    create: {
      username: 'Jane Smith',
      email: 'customer2@example.com',
      password: customer2Password,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });

  const sellerUser3 = await prisma.user.upsert({
    where: { email: 'seller3@example.com' },
    update: {},
    create: {
      username: 'Mister Number Three',
      email: 'seller3@example.com',
      password: seller3Password,
      role: 'SELLER',
      emailVerified: new Date(),
    },
  });

  const customerUser3 = await prisma.user.upsert({
    where: { email: 'customer3@example.com' },
    update: {},
    create: {
      username: 'Alice Wonderland',
      email: 'customer3@example.com',
      password: customer3Password,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });

  const customerUser4 = await prisma.user.upsert({
    where: { email: 'customer4@example.com' },
    update: {},
    create: {
      username: 'Bob Builder',
      email: 'customer4@example.com',
      password: customer4Password,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });

  const customerUser5 = await prisma.user.upsert({
    where: { email: 'customer5@example.com' },
    update: {},
    create: {
      username: 'Charlie Brown',
      email: 'customer5@example.com',
      password: customer5Password,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });

  // ============ PROFILES ============
  const admin = await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: { userId: adminUser.id },
  });

  const seller1 = await prisma.seller.upsert({
    where: { userId: sellerUser1.id },
    update: {},
    create: {
      userId: sellerUser1.id,
      email: sellerUser1.email,
      image: 'https://cdn-icons-png.flaticon.com/512/10003/10003970.png'
    }
  });

  const seller2 = await prisma.seller.upsert({
    where: { userId: sellerUser2.id },
    update: {},
    create: {
      userId: sellerUser2.id,
      email: sellerUser2.email,
      image: 'https://cdn-icons-png.flaticon.com/256/2127/2127659.png',
    },
  });

  const customer1 = await prisma.customer.upsert({
    where: { userId: customerUser1.id },
    update: {},
    create: {
      userId: customerUser1.id,
      image: 'https://i.pinimg.com/474x/e4/c5/9f/e4c59fdbb41ccd0f87dc0be871d91d98.jpg',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { userId: customerUser2.id },
    update: {},
    create: {
      userId: customerUser2.id,
      image: 'https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png',
    },
  });

  const seller3 = await prisma.seller.upsert({
    where: { userId: sellerUser3.id },
    update: {},
    create: {
      userId: sellerUser3.id,
      email: sellerUser3.email,
      image: 'https://cdn-icons-png.flaticon.com/512/10003/10003972.png',
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { userId: customerUser3.id },
    update: {},
    create: {
      userId: customerUser3.id,
      image: 'https://cdn-icons-png.flaticon.com/512/9308/9308266.png',
    },
  });

  const customer4 = await prisma.customer.upsert({
    where: { userId: customerUser4.id },
    update: {},
    create: {
      userId: customerUser4.id,
      image: 'https://cdn-icons-png.flaticon.com/512/3048/3048122.png',
    },
  });

  const customer5 = await prisma.customer.upsert({
    where: { userId: customerUser5.id },
    update: {},
    create: {
      userId: customerUser5.id,
      image: 'https://cdn-icons-png.flaticon.com/512/4042/4042422.png',
    },
  });

  // ============ ADDRESSES ============
  const address1 = await prisma.address.create({
    data: {
      customerId: customer1.id,
      phoneNumber: '0912345678',
      address: '123 Main Street, Apartment 4B',
      street: 'Main Street',
      ward: 'Ward 1',
      district: 'District 1',
      province: 'Ho Chi Minh City',
    },
  });

  const address2 = await prisma.address.create({
    data: {
      customerId: customer1.id,
      phoneNumber: '0987654321',
      address: '456 Secondary Ave',
      street: 'Secondary Avenue',
      ward: 'Ward 2',
      district: 'District 2',
      province: 'Hanoi',
    },
  });

  const address3 = await prisma.address.create({
    data: {
      customerId: customer2.id,
      phoneNumber: '0934567890',
      address: '789 Third Boulevard',
      street: 'Third Boulevard',
      ward: 'Ward 3',
      district: 'District 3',
      province: 'Da Nang',
    },
  });

  const address4 = await prisma.address.create({
    data: {
      customerId: customer3.id,
      phoneNumber: '0901112223',
      address: '101 Wonderland Lane',
      street: 'Wonderland Lane',
      ward: 'Ward 4',
      district: 'District 4',
      province: 'Can Tho',
    },
  });

  // ============ CATEGORIES ============
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
    },
  });

  const fashion = await prisma.category.upsert({
    where: { name: 'Fashion' },
    update: {},
    create: {
      name: 'Fashion',
      description: 'Clothing and apparel',
    },
  });

  const homeGoods = await prisma.category.upsert({
    where: { name: 'Home & Garden' },
    update: {},
    create: {
      name: 'Home & Garden',
      description: 'Home and garden products',
    },
  });

  const sports = await prisma.category.upsert({
    where: { name: 'Sports & Outdoors' },
    update: {},
    create: {
      name: 'Sports & Outdoors',
      description: 'Sporting equipment and outdoor gear',
    },
  });

  const books = await prisma.category.upsert({
    where: { name: 'Books' },
    update: {},
    create: {
      name: 'Books',
      description: 'Books and literature',
    },
  });

  const toys = await prisma.category.upsert({
    where: { name: 'Toys & Games' },
    update: {},
    create: {
      name: 'Toys & Games',
      description: 'Toys, games, and puzzles',
    },
  });

  // ============ PRODUCTS ============
  const product1 = await prisma.product.create({
    data: {
      name: 'Wireless Earbuds Pro',
      description: 'Premium wireless earbuds with noise cancellation',
      stockQuantity: 150,
      images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/333561/tai-nghe-tws-xiaomi-redmi-buds-6-den-3-638707208403801581-750x500.jpg', 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/333561/tai-nghe-tws-xiaomi-redmi-buds-6-den-10-638707208456038532-750x500.jpg'],
      createdBy: seller1.id,
      price: 199.99,
      categoryId: electronics.id,
      variantTypes: [Variants.COLOR],
      variantOptions: { colors: ['Black', 'White', 'Blue'] },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Smartphone X',
      description: '5G smartphone with 128GB storage',
      stockQuantity: 50,
      images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/341837/tecno-spark-go-2-xanh-thumb-638899027806878098-600x600.jpg', 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/341837/tecno-spark-go-2-black-4-638925101014228510-750x500.jpg'],
      createdBy: seller1.id,
      price: 899.99,
      categoryId: electronics.id,
      variantTypes: [Variants.COLOR, Variants.SIZE],
      variantOptions: { colors: ['Black', 'Silver', 'Gold'], sizes: ['64GB', '128GB', '256GB'] },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Casual T-Shirt',
      description: '100% cotton comfortable t-shirt',
      stockQuantity: 200,
      images: ["https://d3design.vn/uploads/tshirt'p.jpg"],
      createdBy: seller2.id,
      price: 29.99,
      categoryId: fashion.id,
      variantTypes: [Variants.SIZE, Variants.COLOR],
      variantOptions: { sizes: ['S', 'M', 'L', 'XL'], colors: ['Red', 'Blue', 'Green'] },
    },
  });

  const product4 = await prisma.product.create({
    data: {
      name: 'Coffee Maker',
      description: 'Automatic coffee maker with timer',
      stockQuantity: 80,
      images: ['https://i5.walmartimages.com/seo/Mainstays-Black-5-Cup-Drip-Coffee-Maker-New_16f77040-27ab-4008-9852-59c900d7a7d9_1.c524f1d9c465e122596bf65f939c8d26.jpeg'],
      createdBy: seller2.id,
      price: 79.99,
      categoryId: homeGoods.id,
      variantTypes: [],
      variantOptions: {},
    },
  });

  const product5 = await prisma.product.create({
    data: {
      name: 'Yoga Mat',
      description: 'Premium non-slip yoga mat',
      stockQuantity: 100,
      images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2680&auto=format&fit=crop'],
      createdBy: seller3.id,
      price: 25.00,
      categoryId: sports.id,
      variantTypes: [Variants.COLOR],
      variantOptions: { colors: ['Pink', 'Purple'] },
    },
  });

  const product7 = await prisma.product.create({
    data: {
      name: 'Clean Code',
      description: 'A Handbook of Agile Software Craftsmanship',
      stockQuantity: 200,
      images: ['https://m.media-amazon.com/images/I/41jEbK-jG+L._SX258_BO1,204,203,200_.jpg'],
      createdBy: seller1.id,
      price: 40.00,
      categoryId: books.id,
      variantTypes: [],
      variantOptions: {},
    },
  });

  const product8 = await prisma.product.create({
    data: {
      name: 'LEGO Star Wars',
      description: 'Millennium Falcon building kit',
      stockQuantity: 15,
      images: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=2071&auto=format&fit=crop'],
      createdBy: seller3.id,
      price: 159.99,
      categoryId: toys.id,
      variantTypes: [],
      variantOptions: {},
    },
  });

  // ============ PRODUCT VARIANTS ============
  const variant1 = await prisma.productVariant.create({
    data: {
      quantity: 50,
      variantAttributes: { color: 'Black' },
      productId: product1.id,
      images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/333561/tai-nghe-tws-xiaomi-redmi-buds-6-den-10-638707208456038532-750x500.jpg'],
      priceAdjustment: 0,
    },
  });

  const variant2 = await prisma.productVariant.create({
    data: {
      quantity: 40,
      variantAttributes: { color: 'White' },
      productId: product1.id,
      images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/333561/tai-nghe-tws-xiaomi-redmi-buds-6-trang-10-638708270681754635-750x500.jpg'],
      priceAdjustment: 0,
    },
  });

  const variant3 = await prisma.productVariant.create({
    data: {
      quantity: 30,
      variantAttributes: { color: 'Black', size: '128GB' },
      productId: product2.id,
      images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/341837/tecno-spark-go-2-black-1-638925101036906076-750x500.jpg'],
      priceAdjustment: 0,
    },
  });

  const variant4 = await prisma.productVariant.create({
    data: {
      quantity: 25,
      variantAttributes: { color: 'Silver', size: '256GB' },
      productId: product2.id,
      images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/341837/tecno-spark-go-2-xam-1-638925124442876676-750x500.jpg'],
      priceAdjustment: 49.99,
    },
  });

  const variant5 = await prisma.productVariant.create({
    data: {
      quantity: 60,
      variantAttributes: { size: 'M', color: 'Blue' },
      productId: product3.id,
      images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmkpQEgj50rjwfk2YGaDHxfhyb37RmeOJQqw&s'],
      priceAdjustment: 0,
    },
  });

  const variant6 = await prisma.productVariant.create({
    data: {
      quantity: 50,
      variantAttributes: { color: 'Pink' },
      productId: product5.id,
      images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2680&auto=format&fit=crop'],
      priceAdjustment: 0,
    },
  });

  const variant7 = await prisma.productVariant.create({
    data: {
      quantity: 50,
      variantAttributes: { color: 'Purple' },
      productId: product5.id,
      images: ['https://images.unsplash.com/photo-1599447421405-0c1a1141d005?q=80&w=2515&auto=format&fit=crop'],
      priceAdjustment: 0,
    },
  });

  // ============ CART & CART ITEMS ============
  const cart1 = await prisma.cart.create({
    data: { customerId: customer1.id },
  });

  const cart2 = await prisma.cart.create({
    data: { customerId: customer2.id },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart1.id,
      productVariantId: variant1.id,
      quantity: 2,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart2.id,
      productVariantId: variant3.id,
      quantity: 1,
    },
  });

  // ============ ORDERS ============
  const order1 = await prisma.order.create({
    data: {
      customer: { connect: { id: customer1.id } },
      address: { connect: { id: address1.id } },
      status: 'DELIVERED',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customer: { connect: { id: customer2.id } },
      address: { connect: { id: address3.id } },
      status: 'PENDING',
    },
  });

  // ============ ORDER ITEMS ============
  const orderItem1 = await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productVariantId: variant1.id,
      quantity: 2,
    },
  });

  const orderItem2 = await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productVariantId: variant5.id,
      quantity: 1,
    },
  });

  const orderItem3 = await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productVariantId: variant3.id,
      quantity: 1,
    },
  });

  // Additional order for new customer
  const order3 = await prisma.order.create({
    data: {
      customer: { connect: { id: customer3.id } },
      address: { connect: { id: address4.id } },
      status: 'DELIVERED',
    },
  });

  const orderItem4 = await prisma.orderItem.create({
    data: {
      orderId: order3.id,
      productVariantId: variant6.id, // Pink Yoga Mat
      quantity: 1,
    },
  });

  // ============ PAYMENTS ============
  await prisma.payment.create({
    data: {
      orderId: order1.id,
      amount: 429.97,
      method: 'COD',
      status: 'SUCCESS',
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order2.id,
      amount: 899.99,
      method: 'VNPAY',
      status: 'PENDING',
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order3.id,
      amount: 25.00,
      method: 'COD',
      status: 'SUCCESS',
    },
  });

  // ============ REVIEWS ============
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent product, highly recommend!',
      images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/333561/tai-nghe-tws-xiaomi-redmi-buds-6-den-12-638707208469040457-750x500.jpg'],
      orderItemId: orderItem1.id,
      customerId: customer1.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Good quality, fast shipping',
      images: [],
      orderItemId: orderItem2.id,
      customerId: customer1.id,
    },
  });

  // ============ RETURNS & CANCELLATIONS ============
  await prisma.return.create({
    data: {
      orderId: order1.id,
      reason: 'Product defective',
      status: 'APPROVED',
    },
  });

  const order4 = await prisma.order.create({
    data: {
      customer: { connect: { id: customer3.id } },
      address: { connect: { id: address4.id } },
      status: 'CANCELLED',
    },
  });

  await prisma.cancellation.create({
    data: {
      orderId: order4.id,
      reason: 'Changed mind',
      status: 'COMPLETED',
    },
  });

  // ============ PROMOTIONS & COUPONS ============
  const promotion1 = await prisma.promotion.create({
    data: {
      name: 'Summer Sale 2024',
      description: '20% off on electronics',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31'),
      createdBy: admin.id,
      status: 'ACTIVE',
      appliedProducts: {
        connect: [{ id: product1.id }, { id: product2.id }],
      },
    },
  });

  const promotion2 = await prisma.promotion.create({
    data: {
      name: 'Fashion Week',
      description: '15% off on all fashion items',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-30'),
      createdBy: admin.id,
      status: 'ACTIVE',
      appliedCategories: {
        connect: [{ id: fashion.id }],
      },
    },
  });

  // ============ COUPONS ============
  await prisma.coupon.create({
    data: {
      promotionId: promotion1.id,
      code: 'SUMMER20',
      discountPercentage: 20,
      maxUsage: 100,
    },
  });

  await prisma.coupon.create({
    data: {
      promotionId: promotion2.id,
      code: 'FASHION15',
      discountPercentage: 15,
      maxUsage: 200,
    },
  });

  // ============ CLEARANCE EVENTS ============
  await prisma.clearanceEvent.create({
    data: {
      promotionId: promotion1.id,
      clearanceLevel: 'HIGH',
    },
  });

  // ============ NOTIFICATIONS ============
  await prisma.notification.create({
    data: {
      userId: customerUser1.id,
      message: 'Your order #1 has been delivered',
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: customerUser2.id,
      message: 'Your payment is pending confirmation',
      isRead: false,
    },
  });

  // ============ REPORTS ============
  await prisma.report.create({
    data: {
      reportType: 'SALES',
      parameters: { startDate: '2024-01-01', endDate: '2024-12-31' },
      data: { totalSales: 5000, totalOrders: 100 },
      generatedBy: admin.id,
    },
  });

  // ============ SYSTEM PARAMETERS ============
  await prisma.systemParameter.upsert({
    where: { key: 'MAX_CART_ITEMS' },
    update: { value: '50' },
    create: {
      key: 'MAX_CART_ITEMS',
      value: '50',
      description: 'Maximum number of items in a cart',
    },
  });

  await prisma.systemParameter.upsert({
    where: { key: 'MIN_ORDER_AMOUNT' },
    update: { value: '10' },
    create: {
      key: 'MIN_ORDER_AMOUNT',
      value: '10',
      description: 'Minimum order amount in USD',
    },
  });

  console.log('✅ Seeding finished successfully!');
  console.log('📊 Seeded data:');
  console.log(`  - 2 Admins, 2 Sellers, 2 Customers`);
  console.log(`  - 3 Addresses`);
  console.log(`  - 3 Categories with 4 Products`);
  console.log(`  - 5 Product Variants`);
  console.log(`  - 2 Orders with 3 Order Items`);
  console.log(`  - 2 Payments & 2 Reviews`);
  console.log(`  - 2 Promotions with Coupons & Clearance Events`);
  console.log(`  - 2 Notifications & 1 Report`);
  console.log(`  - 1 Return & 1 Cancellation`);
  console.log(`  - 2 System Parameters`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
