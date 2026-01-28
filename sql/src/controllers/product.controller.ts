import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service";
import { sendSuccess } from "../utils/ApiResponse";
import {
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
} from "../types/dto/request/product.request.dto";
import { getAuthUser } from "../utils/request";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = getAuthUser(req);
    const productDto = new CreateProductRequestDTO(req.body);
    const product = await productService.createProduct(productDto, user.id);
    sendSuccess(res, "Product created successfully", product, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await productService.getAllProducts(req.query);
    sendSuccess(res, "Products retrieved successfully", products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await productService.getProductById(req.params.id);
    sendSuccess(res, "Product found", product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productDto = new UpdateProductRequestDTO(req.body);
    const product = await productService.updateProduct(
      req.params.id,
      productDto,
    );
    sendSuccess(res, "Product updated successfully", product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await productService.deleteProduct(req.params.id);
    sendSuccess(res, "Product deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
