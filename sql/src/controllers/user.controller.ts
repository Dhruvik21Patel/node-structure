import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { sendSuccess } from "../utils/ApiResponse";
import { UpdateUserRequestDTO } from "../types/dto/request/user.request.dto";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.getAllUsers(req.query);
    sendSuccess(res, "Users retrieved successfully", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, "User found", user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userDto = new UpdateUserRequestDTO(req.body);
    const user = await userService.updateUser(req.params.id, userDto);
    sendSuccess(res, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await userService.deleteUser(req.params.id);
    sendSuccess(res, "User deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
