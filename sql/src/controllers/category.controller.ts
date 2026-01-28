import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/category.service";
import { sendSuccess } from "../utils/ApiResponse";
import {
  CreateCategoryRequestDTO,
  UpdateCategoryRequestDTO,
} from "../types/dto/request/category.request.dto";
import { getAuthUser } from "../utils/request";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = getAuthUser(req);
    const categoryDto = new CreateCategoryRequestDTO(req.body);
    const category = await categoryService.createCategory(categoryDto, user.id);
    sendSuccess(res, "Category created successfully", category, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getAllCategories(req.query);
    sendSuccess(res, "Categories retrieved successfully", categories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    sendSuccess(res, "Category found", category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryDto = new UpdateCategoryRequestDTO(req.body);
    const category = await categoryService.updateCategory(
      req.params.id,
      categoryDto,
    );
    sendSuccess(res, "Category updated successfully", category);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    sendSuccess(res, "Category deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
