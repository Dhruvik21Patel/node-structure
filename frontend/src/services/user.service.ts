import api from "../api/api";
import { APIResponse, PaginatedResponse } from "../types/api.d";
import { IUserResponse, IUpdateUserRequest } from "../types/dtos.d";

class UserService {
  private readonly USER_BASE_URL = "/users"; // Corrected base URL for general user management

  async getMyProfile(): Promise<APIResponse<IUserResponse>> {
    // This method updates the authenticated user's profile, typically from /profile/me
    const response = await api.get<APIResponse<IUserResponse>>(`/profile/me`); // Explicit path for clarity
    return response.data;
  }

  async updateUserProfile( // This method updates the authenticated user's profile
    data: IUpdateUserRequest,
  ): Promise<APIResponse<IUserResponse>> {
    const response = await api.patch<APIResponse<IUserResponse>>(
      `/profile/me`, // Explicit path for clarity
      data,
    );
    return response.data;
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<APIResponse<PaginatedResponse<IUserResponse>>> {
    const response = await api.get<
      APIResponse<PaginatedResponse<IUserResponse>>
    >(this.USER_BASE_URL, {
      params: { page, limit },
    });
    return response.data;
  }

  // New method to update a user by ID (for admin-like functionality)
  async updateUser(id: string, data: IUpdateUserRequest): Promise<APIResponse<IUserResponse>> {
    const response = await api.patch<APIResponse<IUserResponse>>(`${this.USER_BASE_URL}/${id}`, data);
    return response.data;
  }

  // New method to delete a user by ID (for admin-like functionality)
  async deleteUser(id: string): Promise<APIResponse<null>> {
    const response = await api.delete<APIResponse<null>>(`${this.USER_BASE_URL}/${id}`);
    return response.data;
  }
}

export default new UserService();
