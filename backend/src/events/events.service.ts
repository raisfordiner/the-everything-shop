import { prisma } from "util/db";
import { ClearanceLevel } from "@prisma/client";

export default class EventsService {
  static async find(id?: string, promotionId?: string, clearanceLevel?: string) {
    if (id) {
      return await prisma.clearanceEvent.findUnique({
        where: { id },
        include: {
          promotion: {
            select: {
              id: true,
              name: true,
              description: true,
              startDate: true,
              endDate: true,
              status: true,
            },
          },
        },
      });
    }

    return await prisma.clearanceEvent.findMany({
      where: {
        promotionId: promotionId || undefined,
        clearanceLevel: clearanceLevel as ClearanceLevel | undefined,
      },
      include: {
        promotion: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });
  }

  static async create(data: { promotionId: string; clearanceLevel: ClearanceLevel }) {
    const promotion = await prisma.promotion.findUnique({
      where: { id: data.promotionId },
    });

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const existingEvent = await prisma.clearanceEvent.findFirst({
      where: { promotionId: data.promotionId },
    });

    if (existingEvent) {
      throw new Error("Event already exists for this promotion");
    }

    return await prisma.clearanceEvent.create({
      data: {
        promotionId: data.promotionId,
        clearanceLevel: data.clearanceLevel,
      },
      include: {
        promotion: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });
  }

  static async update(id: string, data: { clearanceLevel?: ClearanceLevel }) {
    const event = await prisma.clearanceEvent.findUnique({
      where: { id },
    });

    if (!event) {
      throw new Error("Event not found");
    }

    return await prisma.clearanceEvent.update({
      where: { id },
      data,
      include: {
        promotion: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.clearanceEvent.delete({
      where: { id },
    });
  }
}
