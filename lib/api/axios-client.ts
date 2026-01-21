import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

let baseURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3050').trim();
if (!baseURL.endsWith('/api')) {
    baseURL = `${baseURL.replace(/\/$/, '')}/api`;
}

// Custom interface for extending AxiosRequestConfig
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export const api: AxiosInstance = axios.create({
    baseURL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true // send cookies (refresh token) to API
});

// A lightweight client used to call refresh endpoint without triggering interceptors
const refreshClient: AxiosInstance = axios.create({ baseURL, timeout: 15000, withCredentials: true });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Ensure baseURL and url don't have trailing spaces
    if (config.baseURL) config.baseURL = config.baseURL.trim();
    if (config.url) config.url = config.url.trim();

    // For FormData, let axios set Content-Type with boundary automatically
    // Don't override Content-Type if it's FormData
    if (config.data instanceof FormData) {
        if (config.headers) {
            delete config.headers['Content-Type'];
        }
    }

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (!originalRequest) return Promise.reject(error);

        // If unauthorized and request hasn't been retried, try refresh once
        if (error?.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
            originalRequest._retry = true;

            try {
                const resp = await refreshClient.post('/auth/refresh');
                const newToken = resp.data?.token;

                if (newToken) {
                    localStorage.setItem('token', newToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    if (originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    }
                    return api(originalRequest);
                }

                localStorage.removeItem('token');
                return Promise.reject(error);
            } catch (refreshErr) {
                localStorage.removeItem('token');
                return Promise.reject(refreshErr);
            }
        }

        if (error?.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);
