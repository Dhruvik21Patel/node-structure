import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { sendSuccess } from "../utils/ApiResponse";
import {
  RegisterRequestDTO,
  LoginRequestDTO,
} from "../types/dto/request/auth.request.dto";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registerDto = new RegisterRequestDTO(req.body);
    const user = await authService.register(registerDto);
    sendSuccess(res, "User registered successfully", user, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loginDto = new LoginRequestDTO(req.body);
    const result = await authService.login(loginDto);
    sendSuccess(res, "Login successful", result);
  } catch (error) {
    next(error);
  }
};
