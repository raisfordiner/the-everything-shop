import { prisma } from "util/db";
import { InventoryLogType, RevenueLogType, AuditLogType } from "@prisma/client";

type SortOrder = "asc" | "desc";

export default class ReportService {
    // Inventory Logs
    static async getInventoryLogs(filter?: {
        type?: InventoryLogType;
        startDate?: Date;
        endDate?: Date;
        sortBy?: string;
        sortOrder?: SortOrder;
    }) {
        const where: any = {};
        if (filter?.type) {
            where.type = filter.type;
        }
        if (filter?.startDate || filter?.endDate) {
            where.createdAt = {};
            if (filter?.startDate) where.createdAt.gte = filter.startDate;
            if (filter?.endDate) where.createdAt.lte = filter.endDate;
        }

        const orderBy: any = {};
        const sortField = filter?.sortBy || "createdAt";
        orderBy[sortField] = filter?.sortOrder || "desc";

        return await prisma.inventoryLog.findMany({
            where,
            orderBy,
        });
    }

    static async createInventoryLog(data: {
        type: InventoryLogType;
        productId?: string;
        variantId?: string;
        details?: any;
    }) {
        return await prisma.inventoryLog.create({ data });
    }

    // Revenue Logs
    static async getRevenueLogs(filter?: {
        type?: RevenueLogType;
        startDate?: Date;
        endDate?: Date;
        sortBy?: string;
        sortOrder?: SortOrder;
    }) {
        const where: any = {};
        if (filter?.type) {
            where.type = filter.type;
        }
        if (filter?.startDate || filter?.endDate) {
            where.createdAt = {};
            if (filter?.startDate) where.createdAt.gte = filter.startDate;
            if (filter?.endDate) where.createdAt.lte = filter.endDate;
        }

        const orderBy: any = {};
        const sortField = filter?.sortBy || "createdAt";
        orderBy[sortField] = filter?.sortOrder || "desc";

        return await prisma.revenueLog.findMany({
            where,
            orderBy,
        });
    }

    static async createRevenueLog(data: {
        type: RevenueLogType;
        orderId?: string;
        amount: number;
        details?: any;
    }) {
        return await prisma.revenueLog.create({ data });
    }

    // Audit Logs
    static async getAuditLogs(filter?: {
        type?: AuditLogType;
        startDate?: Date;
        endDate?: Date;
        sortBy?: string;
        sortOrder?: SortOrder;
    }) {
        const where: any = {};
        if (filter?.type) {
            where.type = filter.type;
        }
        if (filter?.startDate || filter?.endDate) {
            where.createdAt = {};
            if (filter?.startDate) where.createdAt.gte = filter.startDate;
            if (filter?.endDate) where.createdAt.lte = filter.endDate;
        }

        const orderBy: any = {};
        const sortField = filter?.sortBy || "createdAt";
        orderBy[sortField] = filter?.sortOrder || "desc";

        return await prisma.auditLog.findMany({
            where,
            orderBy,
        });
    }

    static async createAuditLog(data: {
        type: AuditLogType;
        userId?: string;
        email?: string;
        details?: any;
    }) {
        return await prisma.auditLog.create({ data });
    }
}
