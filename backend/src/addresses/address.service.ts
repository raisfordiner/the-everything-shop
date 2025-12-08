import { prisma } from "util/db";

export default class AddressService {
  static async find(
    id?: string,
    customerId?: string,
    phoneNumber?: string,
    address?: string,
    street?: string,
    ward?: string,
    district?: string,
    province?: string
  ) {
    const include = {
      customer: {
        select: {
          id: true,
          userId: true,
          user: {
            select: {
              username: true,
              email: true,
            },
          },
        },
      },
    };

    if (id) {
      return await prisma.address.findUnique({
        where: { id },
        include: include,
      });
    }

    return await prisma.address.findMany({
      where: {
        customerId: customerId || undefined,
        phoneNumber: phoneNumber || undefined,
        address: address || undefined,
        street: street || undefined,
        ward: ward || undefined,
        district: district || undefined,
        province: province || undefined,
      },
      include: include,
    });
  }

  static async create(data: {
    customerId?: string;
    phoneNumber: string;
    address: string;
    street?: string;
    ward?: string;
    district?: string;
    province?: string;
  }) {
    if (data.customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: data.customerId },
      });

      if (!customer) {
        throw new Error("Customer not found");
      }
    }

    return await prisma.address.create({
      data: {
        customerId: data.customerId,
        phoneNumber: data.phoneNumber,
        address: data.address,
        street: data.street,
        ward: data.ward,
        district: data.district,
        province: data.province,
      },
      include: {
        customer: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  static async update(
    id: string,
    data: {
      phoneNumber?: string;
      address?: string;
      street?: string;
      ward?: string;
      district?: string;
      province?: string;
    }
  ) {
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    return await prisma.address.update({
      where: { id },
      data,
      include: {
        customer: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.address.delete({
      where: { id },
    });
  }
}
