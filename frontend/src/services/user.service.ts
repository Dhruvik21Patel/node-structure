import api from '../api/api';
import { APIResponse, PaginatedResponse } from '../types/api.d'; // Import PaginatedResponse
import { IUserResponse, IUpdateUserRequest } from '../types/dtos.d';

class UserService {
  private readonly USER_BASE_URL = '/users'; // Assuming user routes are under /users

  async getMyProfile(): Promise<APIResponse<IUserResponse>> {
    const response = await api.get<APIResponse<IUserResponse>>(`${this.USER_BASE_URL}/me`);
    return response.data;
  }

  async updateUserProfile(data: IUpdateUserRequest): Promise<APIResponse<IUserResponse>> {
    const response = await api.patch<APIResponse<IUserResponse>>(`${this.USER_BASE_URL}/me`, data);
    return response.data;
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<APIResponse<PaginatedResponse<IUserResponse>>> {
    const response = await api.get<APIResponse<PaginatedResponse<IUserResponse>>>(this.USER_BASE_URL, {
      params: { page, limit },
    });
    return response.data;
  }
}

export default new UserService();
