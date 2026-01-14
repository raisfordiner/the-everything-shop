import { Request, Response } from "express";
import ReportService from "./report.service";

export default class ReportController {
    static async getInventoryLogs(req: Request, res: Response) {
        try {
            const { type, startDate, endDate, sortBy, sortOrder } = req.query;
            const logs = await ReportService.getInventoryLogs({
                type: type as any,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                sortBy: sortBy as string,
                sortOrder: sortOrder as any,
            });
            res.json({ logs });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getRevenueLogs(req: Request, res: Response) {
        try {
            const { type, startDate, endDate, sortBy, sortOrder } = req.query;
            const logs = await ReportService.getRevenueLogs({
                type: type as any,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                sortBy: sortBy as string,
                sortOrder: sortOrder as any,
            });
            res.json({ logs });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAuditLogs(req: Request, res: Response) {
        try {
            const { type, startDate, endDate, sortBy, sortOrder } = req.query;
            const logs = await ReportService.getAuditLogs({
                type: type as any,
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                sortBy: sortBy as string,
                sortOrder: sortOrder as any,
            });
            res.json({ logs });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
