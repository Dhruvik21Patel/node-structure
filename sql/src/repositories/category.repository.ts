import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export type PlainCategory = {
  id: string;
  name: string;
  createdAt: Date;
};

type CategoryFindAllOptions = {
  where?: Prisma.CategoryWhereInput;
  skip?: number;
  take?: number;
  orderBy?: Prisma.CategoryOrderByWithRelationInput;
};

export const create = async (data: {
  name: string;
  userId: string;
}): Promise<PlainCategory> => {
  return prisma.category.create({
    data,
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });
};

export const findById = async (id: string): Promise<PlainCategory | null> => {
  return prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });
};

export const findAll = async (
  options: CategoryFindAllOptions,
): Promise<{ items: PlainCategory[]; total: number }> => {
  const { where, skip, take, orderBy } = options;
  const [items, total] = await prisma.$transaction([
    prisma.category.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    }),
    prisma.category.count({ where }),
  ]);
  return { items, total };
};

export const update = async (
  id: string,
  data: { name: string },
): Promise<PlainCategory | null> => {
  return prisma.category.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });
};

export const remove = async (id: string): Promise<PlainCategory | null> => {
  return prisma.category.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });
};
