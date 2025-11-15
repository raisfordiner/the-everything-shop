import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import EventsService from "./events.service";

export default class EventsController {
  static async getEvents(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { promotionId, clearanceLevel } = req.query;

      const result = await EventsService.find(id, promotionId as string, clearanceLevel as string);

      if (!result) {
        return Send.notFound(res, {}, id ? "Event not found" : "Events not found");
      }

      const response = id ? { event: result } : { events: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching events");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createEvent(req: Request, res: Response) {
    try {
      const { promotionId, clearanceLevel } = req.body;

      const event = await EventsService.create({
        promotionId,
        clearanceLevel,
      });

      return Send.success(res, { event }, "Event created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating event");
      if (error.message === "Promotion not found") {
        return Send.notFound(res, {}, "Promotion not found");
      }
      if (error.message === "Event already exists for this promotion") {
        return Send.error(res, {}, "Event already exists for this promotion");
      }
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async updateEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { clearanceLevel } = req.body;

      const event = await EventsService.update(id, {
        clearanceLevel,
      });

      return Send.success(res, { event }, "Event updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating event");
      if (error.message === "Event not found") {
        return Send.notFound(res, {}, "Event not found");
      }
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await EventsService.delete(id);

      return Send.success(res, {}, "Event deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting event");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
