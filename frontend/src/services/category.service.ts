// frontend/src/services/category.service.ts
import api from '../api/api';
import { APIResponse, PaginatedResponse } from '../types/api.d';
import { ICategoryResponse, ICreateCategoryRequest, IUpdateCategoryRequest } from '../types/dtos.d';

class CategoryService {
  private readonly CATEGORY_BASE_URL = '/categories'; // Assuming category routes are under /categories

  async createCategory(data: ICreateCategoryRequest): Promise<APIResponse<ICategoryResponse>> {
    const response = await api.post<APIResponse<ICategoryResponse>>(this.CATEGORY_BASE_URL, data);
    return response.data;
  }

  async getCategories(page: number = 1, limit: number = 10): Promise<APIResponse<PaginatedResponse<ICategoryResponse>>> {
    const response = await api.get<APIResponse<PaginatedResponse<ICategoryResponse>>>(this.CATEGORY_BASE_URL, {
      params: { page, limit },
    });
    return response.data;
  }

  async getCategoryById(id: string): Promise<APIResponse<ICategoryResponse>> {
    const response = await api.get<APIResponse<ICategoryResponse>>(`${this.CATEGORY_BASE_URL}/${id}`);
    return response.data;
  }

  async updateCategory(id: string, data: IUpdateCategoryRequest): Promise<APIResponse<ICategoryResponse>> {
    const response = await api.patch<APIResponse<ICategoryResponse>>(`${this.CATEGORY_BASE_URL}/${id}`, data);
    return response.data;
  }

  async deleteCategory(id: string): Promise<APIResponse<null>> {
    const response = await api.delete<APIResponse<null>>(`${this.CATEGORY_BASE_URL}/${id}`);
    return response.data;
  }
}

export default new CategoryService();
