import * as productRepository from "../repositories/product.repository";
import * as categoryRepository from "../repositories/category.repository";
import { ApiError } from "../utils/ApiError";
import {
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
} from "../types/dto/request/product.request.dto";
import { ProductResponseDTO } from "../types/dto/response/product.response.dto";
import { PaginatedResponseDTO } from "../types/dto/response/pagination.response.dto";
import { Prisma } from "@prisma/client";
import { paginate } from "../utils/pagination";

export interface ProductQueryOptions {
  page?: string;
  limit?: string;
  name?: string;
  categoryId?: string;
}

export const createProduct = async (
  productData: CreateProductRequestDTO,
  userId: string,
): Promise<ProductResponseDTO> => {
  const category = await categoryRepository.findById(productData.categoryId);
  if (!category) {
    throw new ApiError(400, "Category not found");
  }

  const newProduct = await productRepository.create({
    ...productData,
    user: { connect: { id: userId } },
    category: { connect: { id: productData.categoryId } },
  });
  return new ProductResponseDTO(newProduct);
};

export const getAllProducts = async (options: ProductQueryOptions) => {
  const where: Prisma.ProductWhereInput = {};

  if (options.name) {
    where.name = {
      contains: options.name,
      mode: "insensitive",
    };
  }

  if (options.categoryId) {
    where.categoryId = options.categoryId;
  }

  return paginate(
    productRepository.findAll,
    where,
    options.page,
    options.limit,
    (p) => new ProductResponseDTO(p),
  );
};

export const getProductById = async (
  id: string,
): Promise<ProductResponseDTO> => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return new ProductResponseDTO(product);
};

export const updateProduct = async (
  id: string,
  productData: UpdateProductRequestDTO,
): Promise<ProductResponseDTO> => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (productData.categoryId) {
    const category = await categoryRepository.findById(productData.categoryId);
    if (!category) {
      throw new ApiError(400, "Category not found");
    }
  }

  const updatedProduct = await productRepository.update(id, productData);
  return new ProductResponseDTO(updatedProduct);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  await productRepository.remove(id);
};
