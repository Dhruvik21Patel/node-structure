import * as userRepository from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";
import { UpdateUserRequestDTO } from "../types/dto/request/user.request.dto";
import { UserResponseDTO } from "../types/dto/response/user.response.dto";
import { paginate } from "../utils/pagination";
import { Prisma } from "@prisma/client";

export interface UserQueryOptions {
  page?: string;
  limit?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  status?: string; // comes from query as string
}

export const getAllUsers = async (options: UserQueryOptions) => {
  const andConditions: Prisma.UserWhereInput[] = [];

  if (options.email) {
    andConditions.push({
      email: { contains: options.email, mode: "insensitive" },
    });
  }

  if (options.first_name) {
    andConditions.push({
      first_name: { contains: options.first_name, mode: "insensitive" },
    });
  }

  if (options.last_name) {
    andConditions.push({
      last_name: { contains: options.last_name, mode: "insensitive" },
    });
  }

  if (options.status !== undefined) {
    andConditions.push({
      status: options.status === "true",
    });
  }

  const where: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  return paginate(
    userRepository.findAll,
    where,
    options.page,
    options.limit,
    (u) => new UserResponseDTO(u),
  );
};

export const getUserById = async (id: string): Promise<UserResponseDTO> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return new UserResponseDTO(user);
};

export const updateUser = async (
  id: string,
  userData: UpdateUserRequestDTO,
): Promise<UserResponseDTO> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const updatedUser = await userRepository.update(id, userData);
  return new UserResponseDTO(updatedUser!);
};

export const deleteUser = async (id: string): Promise<void> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  await userRepository.remove(id);
};
