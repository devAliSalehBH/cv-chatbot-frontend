/**
 * API Configuration
 * Centralized configuration for API base URL
 */

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
} as const;

/**
 * Get the API base URL
 */
export const getApiBaseURL = (): string => {
  return apiConfig.baseURL;
};
