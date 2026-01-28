import { Request, Response, NextFunction } from "express";
import * as userRepository from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication invalid");
    }

    const token = authHeader.split(" ")[1];
    const { id } = verifyToken(token);

    const user = await userRepository.findById(id);
    if (!user) {
      throw new ApiError(401, "Authentication invalid");
    }

    req.user = user; // ✅ typed
    next();
  } catch {
    next(new ApiError(401, "Authentication invalid"));
  }
};
