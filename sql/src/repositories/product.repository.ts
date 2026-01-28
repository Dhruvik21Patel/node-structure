import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export type PlainProduct = Prisma.ProductGetPayload<{
  select: typeof productSelect;
}>;

const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  categoryId: true,
  userId: true,
  createdAt: true,
  category: {
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  },
  user: {
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

export const create = async (data: any): Promise<PlainProduct> => {
  return prisma.product.create({
    data,
    select: productSelect,
  });
};

export const findById = async (id: string): Promise<PlainProduct | null> => {
  return prisma.product.findUnique({
    where: { id },
    select: productSelect,
  });
};

export const findAll = async (options: any): Promise<PlainProduct[]> => {
  const { where, skip, take, orderBy } = options;

  return prisma.product.findMany({
    where,
    skip,
    take,
    orderBy,
    select: productSelect, // always enforced
  });
};

export const update = async (
  id: string,
  data: any,
): Promise<PlainProduct | null> => {
  return prisma.product.update({
    where: { id },
    data,
    select: productSelect,
  });
};

export const remove = async (id: string): Promise<PlainProduct | null> => {
  return prisma.product.delete({
    where: { id },
    select: productSelect,
  });
};
