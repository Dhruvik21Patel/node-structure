// frontend/src/services/auth.service.ts
import api from '../api/api';
import { APIResponse } from '../types/api.d';
import { ILoginRequest, IRegisterRequest, IAuthResponse } from '../types/dtos.d';

class AuthService {
  private readonly AUTH_BASE_URL = '/auth';

  async register(credentials: IRegisterRequest): Promise<APIResponse<IAuthResponse>> {
    const response = await api.post<APIResponse<IAuthResponse>>(`${this.AUTH_BASE_URL}/register`, credentials);
    return response.data;
  }

  async login(credentials: ILoginRequest): Promise<APIResponse<IAuthResponse>> {
    const response = await api.post<APIResponse<IAuthResponse>>(`${this.AUTH_BASE_URL}/login`, credentials);
    // Store token on successful login
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('accessToken', response.data.data.token);
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    // Optionally clear other user-related data from storage
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
