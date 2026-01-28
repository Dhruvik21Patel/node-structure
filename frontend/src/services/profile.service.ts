import api from "../api/api";
import { APIResponse } from "../types/api.d";
import { IUserResponse } from "../types/dtos.d";

class UserProfileService {
  async getMyProfile(): Promise<APIResponse<IUserResponse>> {
    // This method updates the authenticated user's profile, typically from /profile/me
    const response = await api.get<APIResponse<IUserResponse>>(`/profile/me`); // Explicit path for clarity
    return response.data;
  }
}

export default new UserProfileService();
