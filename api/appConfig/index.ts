import axios from "axios";

export interface ErrorResponse {
  error: string;
  message: string;
  code: number;
  stack: string;
  path: string;
}

// Generic API Response Types
export interface ResponseBase {
  status?: boolean;
  message: string;
}

export interface BaseResponse<T> extends ResponseBase {
  data: T[];
}

export interface SingleResponse<T> extends ResponseBase {
  data: T;
}

// For paginated responses with cursor-based pagination
export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface PaginatedResponse<T> extends ResponseBase {
  items: T[];
  pagination: PaginationMeta;
  fromCache?: boolean;
}

const apiHttp = axios.create({
  baseURL: "http://localhost:4000/v1/api",
  // process.env.NEXT_PUBLIC_API_BASE_URL || "https://dingpay-be.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with every request
});

// Response interceptor
apiHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        // Handle 401 - redirect to login
        // window.location.href = '/auth/log-in';
      }
    }

    return Promise.reject(error);
  },
);

export default apiHttp;
