// src/repositories/base.repository.ts
import { Prisma } from "@prisma/client";

type PrismaDelegate = {
  create: Function;
  findUnique: Function;
  findFirst: Function;
  findMany: Function;
  update: Function;
  delete: Function;
  count: Function;
};

export class BaseRepository<
  TDelegate extends PrismaDelegate,
  TSelect extends object,
  TPlain,
  TCreateInput,
  TUpdateInput,
  TWhereInput,
  TUniqueWhereInput,
> {
  protected model: TDelegate;
  protected select: TSelect;

  constructor(model: TDelegate, select: TSelect) {
    this.model = model;
    this.select = select;
  }

  async create(data: TCreateInput): Promise<TPlain> {
    return this.model.create({ data, select: this.select }) as Promise<TPlain>;
  }

  async findById(id: string): Promise<TPlain | null> {
    return this.model.findUnique({
      where: { id },
      select: this.select,
    }) as Promise<TPlain | null>;
  }

  async findUnique(where: TUniqueWhereInput): Promise<TPlain | null> {
    return this.model.findUnique({
      where,
      select: this.select,
    }) as Promise<TPlain | null>;
  }

  async findFirst(where: TWhereInput): Promise<TPlain | null> {
    return this.model.findFirst({
      where,
      select: this.select,
    }) as Promise<TPlain | null>;
  }

  async findMany(
    options: {
      where?: TWhereInput;
      skip?: number;
      take?: number;
      orderBy?: Prisma.ProductOrderByWithRelationInput;
    } = {},
  ): Promise<TPlain[]> {
    const { where, skip, take, orderBy } = options;
    return this.model.findMany({
      where,
      skip,
      take,
      orderBy,
      select: this.select,
    }) as Promise<TPlain[]>;
  }

  async update(where: TUniqueWhereInput, data: TUpdateInput): Promise<TPlain> {
    return this.model.update({
      where,
      data,
      select: this.select,
    }) as Promise<TPlain>;
  }

  async delete(where: TUniqueWhereInput): Promise<TPlain> {
    return this.model.delete({ where, select: this.select }) as Promise<TPlain>;
  }

  async count(where?: TWhereInput): Promise<number> {
    return this.model.count({ where });
  }
}
