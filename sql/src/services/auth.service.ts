import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";
import {
  RegisterRequestDTO,
  LoginRequestDTO,
} from "../types/dto/request/auth.request.dto";
import { AuthResponseDTO } from "../types/dto/response/auth.response.dto";
import { UserResponseDTO } from "../types/dto/response/user.response.dto";

export const register = async (
  userData: RegisterRequestDTO,
): Promise<UserResponseDTO> => {
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await userRepository.create({
    ...userData,
    password: hashedPassword,
  });

  return new UserResponseDTO(newUser);
};

export const login = async (
  credentials: LoginRequestDTO,
): Promise<AuthResponseDTO> => {
  const user = await userRepository.findByEmail(credentials.email);
  if (!user || !user.password) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await bcrypt.compare(
    credentials.password,
    user.password,
  );
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "your-secret-key",
    {
      expiresIn: "1d",
    },
  );

  const userDto = new UserResponseDTO(user);
  return new AuthResponseDTO({ user: userDto, token });
};
