// frontend/src/api/api.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { APIResponse } from "../types/api.d"; // Assuming this path

const API_BASE_URL = "http://localhost:3030/api/"; // Use environment variable for base URL

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add JWT token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle API response structure and errors
api.interceptors.response.use(
  (response: AxiosResponse<APIResponse<any>>) => {
    // Assuming the backend always returns a success field for non-error responses
    if (response.data.success === false) {
      // If backend explicitly indicates failure in the success field for a 2xx response
      return Promise.reject(
        new Error(response.data.message || "API request failed"),
      );
    }
    return response;
  },
  (error: AxiosError<APIResponse<any>>) => {
    // Handle specific error codes or response structures
    if (error.response) {
      const { status, data } = error.response;
      let errorMessage = data?.message || "An unexpected error occurred.";

      switch (status) {
        case 401:
          // Unauthorized: e.g., token expired, invalid token
          errorMessage = data?.message || "Unauthorized. Please log in again.";
          // Optionally, redirect to login page or clear token
          // localStorage.removeItem('accessToken');
          // window.location.href = '/login';
          break;
        case 403:
          errorMessage =
            data?.message ||
            "You do not have permission to access this resource.";
          break;
        case 404:
          errorMessage = data?.message || "Resource not found.";
          break;
        case 500:
          errorMessage = data?.message || "Internal server error.";
          break;
        default:
          break;
      }
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error("No response received from server."));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error(error.message));
    }
  },
);

export default api;
