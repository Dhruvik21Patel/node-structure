// frontend/src/types/dtos.d.ts

// Auth DTOs
export interface IRegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}

// Category DTOs
export interface ICreateCategoryRequest {
  name: string;
}

export interface IUpdateCategoryRequest {
  name?: string;
}

export interface ICategoryResponse {
  id: string;
  name: string;
  createdAt: Date;
}

// Product DTOs
export interface ICreateProductRequest {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export interface IUpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
}

export interface IProductResponse {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ICategoryResponse;
  user: IUserResponse;
  createdAt: Date;
}

// User DTOs

export interface IUserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
