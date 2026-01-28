import * as categoryRepository from "../repositories/category.repository";
import { ApiError } from "../utils/ApiError";
import {
  CreateCategoryRequestDTO,
  UpdateCategoryRequestDTO,
} from "../types/dto/request/category.request.dto";
import { CategoryResponseDTO } from "../types/dto/response/category.response.dto";
import { paginate } from "../utils/pagination";
import { Prisma } from "@prisma/client";

export interface CategoryQueryOptions {
  page?: string;
  limit?: string;
  name?: string;
}

export const createCategory = async (
  categoryData: CreateCategoryRequestDTO,
  userId: string,
): Promise<CategoryResponseDTO> => {
  const newCategory = await categoryRepository.create({
    ...categoryData,
    userId: userId,
  });
  return new CategoryResponseDTO(newCategory);
};

export const getAllCategories = async (options: CategoryQueryOptions) => {
  const where: Prisma.CategoryWhereInput = {};

  if (options.name) {
    where.name = {
      contains: options.name,
      mode: "insensitive",
    };
  }

  return paginate(
    categoryRepository.findAll,
    where,
    options.page,
    options.limit,
    (c) => new CategoryResponseDTO(c),
  );
};

export const getCategoryById = async (
  id: string,
): Promise<CategoryResponseDTO> => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return new CategoryResponseDTO(category);
};

export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryRequestDTO,
): Promise<CategoryResponseDTO> => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  const updatedCategory = await categoryRepository.update(id, categoryData);
  return new CategoryResponseDTO(updatedCategory!);
};

export const deleteCategory = async (id: string): Promise<void> => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  await categoryRepository.remove(id);
};
