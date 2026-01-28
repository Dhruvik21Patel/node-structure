import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
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

export type PlainProduct = Prisma.ProductGetPayload<{
  select: typeof productSelect;
}>;

type ProductFindAllOptions = {
  where?: Prisma.ProductWhereInput;
  skip?: number;
  take?: number;
  orderBy?: Prisma.ProductOrderByWithRelationInput;
};

export const create = async (
  data: Prisma.ProductCreateInput,
): Promise<PlainProduct> => {
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

export const findAll = async (
  options: ProductFindAllOptions,
): Promise<{ items: PlainProduct[]; total: number }> => {
  const { where, skip, take, orderBy } = options;
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      select: productSelect,
    }),
    prisma.product.count({ where }),
  ]);
  return { items, total };
};

export const update = async (
  id: string,
  data: Prisma.ProductUpdateInput,
): Promise<PlainProduct> => {
  return prisma.product.update({
    where: { id },
    data,
    select: productSelect,
  });
};

export const remove = async (id: string): Promise<PlainProduct> => {
  return prisma.product.delete({
    where: { id },
    select: productSelect,
  });
};
