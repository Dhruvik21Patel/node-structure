// frontend/src/services/category.service.ts
import api from "../api/api";
import { APIResponse, PaginatedResponse } from "../types/api.d";
import {
  ICategoryResponse,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
} from "../types/dtos.d";

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  name?: string;
}

class CategoryService {
  async createCategory(
    data: ICreateCategoryRequest,
  ): Promise<APIResponse<ICategoryResponse>> {
    const response = await api.post<APIResponse<ICategoryResponse>>(
      "/categories",
      data,
    );
    return response.data;
  }

  async getCategories(params: CategoryQueryParams) {
    const response = await api.get<
      APIResponse<PaginatedResponse<ICategoryResponse>>
    >("/categories", {
      params,
    });
    return response.data;
  }

  async getCategoryById(id: string): Promise<APIResponse<ICategoryResponse>> {
    const response = await api.get<APIResponse<ICategoryResponse>>(
      `/categories/${id}`,
    );
    return response.data;
  }

  async updateCategory(
    id: string,
    data: IUpdateCategoryRequest,
  ): Promise<APIResponse<ICategoryResponse>> {
    const response = await api.put<APIResponse<ICategoryResponse>>(
      `/categories/${id}`,
      data,
    );
    return response.data;
  }

  async deleteCategory(id: string): Promise<APIResponse<null>> {
    const response = await api.delete<APIResponse<null>>(`/categories/${id}`);
    return response.data;
  }
}

export default new CategoryService();
