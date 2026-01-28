import * as userRepository from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";
import { UpdateUserRequestDTO } from "../types/dto/request/user.request.dto";
import { UserResponseDTO } from "../types/dto/response/user.response.dto";

export const getAllUsers = async (options: any) => {
  const {
    page = 1,
    limit = 10,
    email,
    first_name,
    last_name,
    status,
  } = options;

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skip = (pageNumber - 1) * pageSize;

  const andConditions = [];

  if (email) {
    andConditions.push({ email: { contains: email, mode: "insensitive" } });
  }
  if (first_name) {
    andConditions.push({
      first_name: { contains: first_name, mode: "insensitive" },
    });
  }
  if (last_name) {
    andConditions.push({
      last_name: { contains: last_name, mode: "insensitive" },
    });
  }
  if (status !== undefined) {
    andConditions.push({ status: status === "true" });
  }

  const where = andConditions.length ? { AND: andConditions } : {};

  const prismaOptions = {
    skip,
    take: pageSize,
    where,
  };

  const { items, total } = await userRepository.findAll(prismaOptions);

  const totalPages = Math.ceil(total / pageSize);

  return {
    items: items.map((user) => new UserResponseDTO(user)),
    pagination: {
      totalItems: total,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    },
  };
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
