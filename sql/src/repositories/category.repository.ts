import { prisma } from "../config/prisma";

export type PlainCategory = {
  id: string;
  name: string;
  createdAt: Date;
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

export const findAll = async (): Promise<PlainCategory[]> => {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });
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
