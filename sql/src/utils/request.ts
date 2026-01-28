import { Request } from "express";
import { ApiError } from "./ApiError";
import { PlainUser } from "../repositories/user.repository";

export const getAuthUser = (req: Request): PlainUser => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }
  return req.user;
};
