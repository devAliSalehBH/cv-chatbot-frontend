import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getApiBaseURL } from "./apiConfig";

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically adds locale and token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add locale to query params (you can get from context or pass explicitly)
    if (!config.params) {
      config.params = {};
    }

    // Add locale if not already present
    if (!config.params.locale) {
      config.params.locale = "en"; // Default, will be overridden if passed
    }

    // Get token from localStorage (client) or cookies (server)
    if (typeof window !== "undefined") {
      // Client side - get from localStorage
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors globally
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      // Clear auth data
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
        // Redirect to login
        window.location.href = "/auth/login";
      }
    }

    // Handle 403 forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden");
    }

    // Handle 500 server error
    if (error.response?.status === 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

/**
 * API Response wrapper type
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

/**
 * API Error type
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

/**
 * Request options
 */
export interface RequestOptions extends AxiosRequestConfig {
  locale?: string;
  token?: string;
}

/**
 * GET Request
 */
export async function apiGet<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { locale, token, ...config } = options;

  const requestConfig: AxiosRequestConfig = {
    ...config,
    params: {
      locale: locale || "en",
      ...config.params,
    },
  };

  if (token) {
    if (!requestConfig.headers) {
      requestConfig.headers = {};
    }
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.get<T>(url, requestConfig);
  return {
    data: response.data,
    status: response.status,
  };
}

/**
 * POST Request
 */
export async function apiPost<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { locale, token, ...config } = options;
  console.log("Token received:", token);
  const requestConfig: AxiosRequestConfig = {
    ...config,
    params: {
      locale: locale || "en",
      ...config.params,
    },
  };

  if (token) {
    console.log("Adding token to headers");
    if (!requestConfig.headers) {
      requestConfig.headers = {};
    }
    requestConfig.headers.Authorization = `Bearer ${token}`;
    console.log("Headers after adding token:", requestConfig.headers);
  }

  const response = await apiClient.post<T>(url, data, requestConfig);
  return {
    data: response.data,
    status: response.status,
  };
}

/**
 * PUT Request
 */
export async function apiPut<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { locale, token, ...config } = options;

  const requestConfig: AxiosRequestConfig = {
    ...config,
    params: {
      locale: locale || "en",
      ...config.params,
    },
  };

  if (token) {
    if (!requestConfig.headers) {
      requestConfig.headers = {};
    }
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.put<T>(url, data, requestConfig);
  return {
    data: response.data,
    status: response.status,
  };
}

/**
 * PATCH Request
 */
export async function apiPatch<T = any>(
  url: string,
  data?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { locale, token, ...config } = options;

  const requestConfig: AxiosRequestConfig = {
    ...config,
    params: {
      locale: locale || "en",
      ...config.params,
    },
  };

  if (token) {
    if (!requestConfig.headers) {
      requestConfig.headers = {};
    }
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.patch<T>(url, data, requestConfig);
  return {
    data: response.data,
    status: response.status,
  };
}

/**
 * DELETE Request
 */
export async function apiDelete<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { locale, token, ...config } = options;

  const requestConfig: AxiosRequestConfig = {
    ...config,
    params: {
      locale: locale || "en",
      ...config.params,
    },
  };

  if (token) {
    if (!requestConfig.headers) {
      requestConfig.headers = {};
    }
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  const response = await apiClient.delete<T>(url, requestConfig);
  return {
    data: response.data,
    status: response.status,
  };
}

/**
 * Export axios instance for advanced usage
 */
export default apiClient;
