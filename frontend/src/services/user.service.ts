// src/services/user.service.ts
import api from "../api/api";
import { APIResponse, PaginatedResponse } from "../types/api.d";
import { IUserResponse } from "../types/dtos.d";

export interface UserQueryParams {
  page?: number;
  limit?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  status?: boolean;
}

class UserService {
  // READ (paginated + filters)
  async getUsers(params: UserQueryParams) {
    const response = await api.get<
      APIResponse<PaginatedResponse<IUserResponse>>
    >("/users", {
      params,
    });
    return response.data;
  }
}

export default new UserService();
