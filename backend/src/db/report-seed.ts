import { PrismaClient, InventoryLogType, RevenueLogType, AuditLogType } from '@prisma/client';

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to generate dates with some clustering in recent months
const getWeightedRandomDate = (yearsBack: number = 2) => {
    const end = new Date();
    const start = new Date();
    start.setFullYear(end.getFullYear() - yearsBack);

    // 70% chance to be in the last 6 months
    if (Math.random() < 0.7) {
        const recentStart = new Date();
        recentStart.setMonth(end.getMonth() - 6);
        return getRandomDate(recentStart, end);
    }

    return getRandomDate(start, end);
};

export async function seedReports(prisma: PrismaClient) {
    console.log('📊 Seeding Report Data...');

    const products = await prisma.product.findMany();
    const users = await prisma.user.findMany();
    const orders = await prisma.order.findMany();

    if (products.length === 0 || users.length === 0) {
        console.warn('⚠️ Not enough data to seed reports. Skipping...');
        return;
    }

    // ============ INVENTORY LOGS ============
    console.log('  - Generating Inventory Logs...');
    const inventoryLogs: any[] = [];

    // 1. PRODUCT_CREATED logs for existing products (backdated)
    for (const product of products) {
        inventoryLogs.push({
            type: InventoryLogType.PRODUCT_CREATED,
            productId: product.id,
            details: { productName: product.name, price: product.price },
            createdAt: getRandomDate(new Date(2024, 0, 1), new Date()) // Spread over last ~2 years
        });
    }

    // 2. Random OUT_OF_STOCK events
    for (let i = 0; i < 50; i++) {
        const product = products[getRandomInt(0, products.length - 1)];
        inventoryLogs.push({
            type: InventoryLogType.OUT_OF_STOCK,
            productId: product.id,
            details: { productName: product.name, reason: 'High demand' },
            createdAt: getWeightedRandomDate(2)
        });
    }

    await prisma.inventoryLog.createMany({ data: inventoryLogs });


    // ============ REVENUE LOGS ============
    console.log('  - Generating Revenue Logs...');
    const revenueLogs: any[] = [];

    // 1. Backfill revenue from existing orders if they don't have logs (optional, but good for consistency)
    // Actually, let's just generate fake revenue logs to fill the charts
    for (let i = 0; i < 200; i++) {
        const orderId = orders.length > 0 && i < orders.length ? orders[i].id : `ord_${i}_fake`;
        const amount = getRandomInt(20, 500) + (Math.random() > 0.5 ? 0.99 : 0.00);

        revenueLogs.push({
            type: RevenueLogType.ORDER_COMPLETED,
            orderId: orderId,
            amount: amount,
            details: { itemCount: getRandomInt(1, 5) },
            createdAt: getWeightedRandomDate(2)
        });
    }

    // 2. Returns and Cancellations
    for (let i = 0; i < 30; i++) {
        const amount = getRandomInt(20, 200);
        revenueLogs.push({
            type: Math.random() > 0.5 ? RevenueLogType.RETURN_COMPLETED : RevenueLogType.CANCELLATION_COMPLETED,
            amount: -amount, // Negative for returns
            details: { reason: 'Customer changed mind' },
            createdAt: getWeightedRandomDate(2)
        });
    }

    await prisma.revenueLog.createMany({ data: revenueLogs });


    // ============ AUDIT LOGS ============
    console.log('  - Generating Audit Logs (High Volume)...');
    const auditLogs: any[] = [];

    // 1. Real User Signups
    for (const user of users) {
        auditLogs.push({
            type: AuditLogType.USER_SIGNUP,
            userId: user.id,
            email: user.email,
            details: { username: user.username, role: user.role },
            createdAt: getRandomDate(new Date(2024, 0, 1), new Date())
        });
    }

    // 2. Fake Signups (to fill the chart) - Generate ~2000 fake signups over 2 years
    // approx 2-3 per day
    for (let i = 0; i < 2000; i++) {
        const fakeId = `fake_user_${i}_${Date.now()}`;
        auditLogs.push({
            type: AuditLogType.USER_SIGNUP,
            userId: fakeId,
            email: `visitor${i}@example.com`,
            details: { username: `Visitor ${i}`, role: 'CUSTOMER' },
            createdAt: getRandomDate(new Date(2024, 0, 1), new Date())
        });
    }

    // 3. Logins (High volume) - Generate ~10,000 logins over 2 years
    // approx 13-14 per day on average, with clustering
    for (let i = 0; i < 10000; i++) {
        const isRealUser = Math.random() > 0.8; // 20% chance it's a real user
        const user = isRealUser ? users[getRandomInt(0, users.length - 1)] : null;
        const userId = user ? user.id : `fake_user_${getRandomInt(0, 1999)}`;
        const email = user ? user.email : `visitor${getRandomInt(0, 1999)}@example.com`;

        auditLogs.push({
            type: AuditLogType.USER_LOGIN,
            userId: userId,
            email: email,
            details: { method: 'email', ip: `192.168.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}` },
            // Use weighted date to make recent activity richer, but ensure >10/day coverage requires simple uniform distribution too.
            // Let's mix: 50% uniform 2 years, 50% weighted recent.
            createdAt: Math.random() > 0.5 ? getRandomDate(new Date(2024, 0, 1), new Date()) : getWeightedRandomDate(2)
        });
    }

    // Batch insert to avoid "too many parameters" error if the driver limits it, 
    // though Prisma usually handles this. If 12000 rows is too much, split it.
    // 12000 * params might be okay. Let's try chunking just in case.
    const chunkSize = 1000;
    for (let i = 0; i < auditLogs.length; i += chunkSize) {
        const chunk = auditLogs.slice(i, i + chunkSize);
        await prisma.auditLog.createMany({ data: chunk });
    }

    console.log('✅ Reports Seeded Successfully!');
}
