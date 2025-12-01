import Send from "util/response";
import { Request, Response } from "express";
import { logger } from "util/logger";
import ReviewsService from "./reviews.service";

export default class ReviewsController {
  static async getReviews(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { q, customerId, minRating, maxRating } = req.query;

      const result = await ReviewsService.find(
        id,
        q as string,
        customerId as string,
        minRating ? Number(minRating) : undefined,
        maxRating ? Number(maxRating) : undefined
      );

      if (!result) {
        return Send.notFound(res, {}, id ? "Review not found" : "Reviews not found");
      }

      const response = id ? { review: result } : { reviews: result };
      return Send.success(res, response);
    } catch (error) {
      logger.error({ error }, "Error fetching reviews");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async createReview(req: Request, res: Response) {
    try {
      const { rating, comment, images, orderItemId, customerId } = req.body;

      const review = await ReviewsService.create({
        rating,
        comment,
        images,
        orderItemId,
        customerId,
      });

      return Send.success(res, { review }, "Review created successfully");
    } catch (error: any) {
      logger.error({ error }, "Error creating review");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async updateReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rating, comment, images } = req.body;

      const review = await ReviewsService.update(id, {
        rating,
        comment,
        images,
      });

      return Send.success(res, { review }, "Review updated successfully");
    } catch (error: any) {
      logger.error({ error }, "Error updating review");
      return Send.error(res, {}, "Internal server error");
    }
  }

  static async deleteReview(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await ReviewsService.delete(id);

      return Send.success(res, {}, "Review deleted successfully");
    } catch (error) {
      logger.error({ error }, "Error deleting review");
      return Send.error(res, {}, "Internal server error");
    }
  }
}
