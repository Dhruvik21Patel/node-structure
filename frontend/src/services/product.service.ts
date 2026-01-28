// frontend/src/services/product.service.ts
import api from '../api/api';
import { APIResponse, PaginatedResponse } from '../types/api.d';
import { IProductResponse, ICreateProductRequest, IUpdateProductRequest } from '../types/dtos.d';

class ProductService {
  private readonly PRODUCT_BASE_URL = '/products'; // Assuming product routes are under /products

  async createProduct(data: ICreateProductRequest): Promise<APIResponse<IProductResponse>> {
    const response = await api.post<APIResponse<IProductResponse>>(this.PRODUCT_BASE_URL, data);
    return response.data;
  }

  async getProducts(page: number = 1, limit: number = 10): Promise<APIResponse<PaginatedResponse<IProductResponse>>> {
    const response = await api.get<APIResponse<PaginatedResponse<IProductResponse>>>(this.PRODUCT_BASE_URL, {
      params: { page, limit },
    });
    return response.data;
  }

  async getProductById(id: string): Promise<APIResponse<IProductResponse>> {
    const response = await api.get<APIResponse<IProductResponse>>(`${this.PRODUCT_BASE_URL}/${id}`);
    return response.data;
  }

  async updateProduct(id: string, data: IUpdateProductRequest): Promise<APIResponse<IProductResponse>> {
    const response = await api.patch<APIResponse<IProductResponse>>(`${this.PRODUCT_BASE_URL}/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string): Promise<APIResponse<null>> {
    const response = await api.delete<APIResponse<null>>(`${this.PRODUCT_BASE_URL}/${id}`);
    return response.data;
  }
}

export default new ProductService();
