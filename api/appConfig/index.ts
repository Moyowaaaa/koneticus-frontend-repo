import axios from "axios";

// const token = localStorage.getItem("sdsdsdsdsdsd");

export interface ErrorResponse {
  error: string;
  message: string;
  code: number;
  stack: string;
  path: string;
}

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

const apiHttp = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://dingpay-be.onrender.com",
  // timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

apiHttp.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${getAuthToken()}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (typeof window !== "undefined") {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          originalRequest.headers.Authorization = `Bearer ${getAuthToken()}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Handle refresh failure - redirect to login
          // window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiHttp;
