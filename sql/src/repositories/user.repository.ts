import { prisma } from "../config/prisma";

// A plain user object type, reflecting the DB schema for internal use
export type PlainUser = {
  id: string;
  email: string;
  password?: string; // Optional because we don't always select it
  first_name: string;
  last_name: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const userSelect = {
  id: true,
  email: true,
  first_name: true,
  last_name: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

export const create = async (data: any): Promise<PlainUser> => {
  return prisma.user.create({
    data,
    select: userSelect,
  });
};

export const findByEmail = async (email: string): Promise<PlainUser | null> => {
  return prisma.user.findUnique({
    where: { email },
    // Select password for login verification
    select: {
      ...userSelect,
      password: true,
    },
  });
};

export const findById = async (id: string): Promise<PlainUser | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
};

export const findAll = async (
  options: any,
): Promise<{ items: PlainUser[]; total: number }> => {
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      ...options,
      select: userSelect,
    }),
    prisma.user.count({ where: options.where }),
  ]);

  return { items, total };
};

export const update = async (
  id: string,
  data: any,
): Promise<PlainUser | null> => {
  return prisma.user.update({
    where: { id },
    data,
    select: userSelect,
  });
};

export const remove = async (id: string): Promise<PlainUser | null> => {
  return prisma.user.delete({
    where: { id },
    select: userSelect,
  });
};
