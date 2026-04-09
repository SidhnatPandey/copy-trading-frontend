import axios from 'axios';
import { env } from "next-runtime-env";

const baseUrl = env('NEXT_PUBLIC_BASE_URL');

const axiosInstance = axios.create({
    baseURL: baseUrl,
});

export const setApiBaseUrl = (url: string) => {
    let base_url = url;
    switch (url) {
        case 'core' :
            base_url = baseUrl;
            break;
        case 'security' :
            base_url = env('NEXT_PUBLIC_SECURITY_BASE_URL');
            break;
        case 'copy-trading' :
            base_url = env('NEXT_PUBLIC_COPY_TRADING_BASE_URL');
            break;
        default :
            base_url = baseUrl;
    }
    axiosInstance.defaults.baseURL = base_url;
}

// Request Interceptor: Modify or add headers to outgoing requests
axiosInstance.interceptors.request.use(
    (config) => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) { config.headers["Authorization"] = `Bearer ${jwtToken}` }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle responses and errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response) {
            if (error?.response?.status === 401) {
                // clear the local storage and redirect to login page
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
