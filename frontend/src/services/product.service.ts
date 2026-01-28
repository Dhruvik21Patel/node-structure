// frontend/src/services/product.service.ts
import api from "../api/api";
import { APIResponse, PaginatedResponse } from "../types/api.d";
import {
  IProductResponse,
  ICreateProductRequest,
  IUpdateProductRequest,
} from "../types/dtos.d";
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  categoryId?: string;
}

class ProductService {
  async createProduct(
    data: ICreateProductRequest,
  ): Promise<APIResponse<IProductResponse>> {
    const response = await api.post<APIResponse<IProductResponse>>(
      "/products",
      data,
    );
    return response.data;
  }

  async getProducts(
    params: ProductQueryParams,
  ) {
    const response = await api.get<
      APIResponse<PaginatedResponse<IProductResponse>>
    >("/products", {
      params,
    });
    return response.data;
  }

  async getProductById(id: string): Promise<APIResponse<IProductResponse>> {
    const response = await api.get<APIResponse<IProductResponse>>(
      `/products/${id}`,
    );
    return response.data;
  }

  async updateProduct(
    id: string,
    data: IUpdateProductRequest,
  ): Promise<APIResponse<IProductResponse>> {
    const response = await api.put<APIResponse<IProductResponse>>(
      `/products/${id}`,
      data,
    );
    return response.data;
  }

  async deleteProduct(id: string): Promise<APIResponse<null>> {
    const response = await api.delete<APIResponse<null>>(`/products/${id}`);
    return response.data;
  }
}

export default new ProductService();
