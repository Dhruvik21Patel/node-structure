import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/ApiResponse";
import { getAuthUser } from "../utils/request";
import * as userService from "../services/user.service";

export const myProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUser = getAuthUser(req);
    const user = await userService.getUserById(currentUser.id);
    sendSuccess(res, "User found", user);
  } catch (error) {
    next(error);
  }
};
