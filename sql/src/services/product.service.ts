import * as productRepository from "../repositories/product.repository";
import * as categoryRepository from "../repositories/category.repository";
import { ApiError } from "../utils/ApiError";
import {
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
} from "../types/dto/request/product.request.dto";
import { ProductResponseDTO } from "../types/dto/response/product.response.dto";

export const createProduct = async (
  productData: CreateProductRequestDTO,
  userId: string,
): Promise<ProductResponseDTO> => {
  const category = await categoryRepository.findById(productData.categoryId);
  if (!category) {
    throw new ApiError(400, "Category not found");
  }

  const newProduct = await productRepository.create({ ...productData, userId });
  return new ProductResponseDTO(newProduct);
};

export const getAllProducts = async (
  options: any,
): Promise<ProductResponseDTO[]> => {
  const { page = 1, limit = 10, name, categoryId } = options;
  const skip = (page - 1) * limit;

  const prismaOptions: any = {
    skip,
    take: parseInt(limit, 10),
    where: {},
  };

  if (name) {
    prismaOptions.where.name = { contains: name, mode: "insensitive" };
  }

  if (categoryId) {
    prismaOptions.where.categoryId = categoryId;
  }

  const products = await productRepository.findAll(prismaOptions);
  return products.map((product) => new ProductResponseDTO(product));
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
  return new ProductResponseDTO(updatedProduct!);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  await productRepository.remove(id);
};
