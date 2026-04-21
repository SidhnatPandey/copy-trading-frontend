import axios from 'axios';

const baseUrl = import.meta.env.VITE_NEXT_PUBLIC_BASE_URL || '';

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
            base_url = import.meta.env.VITE_NEXT_PUBLIC_SECURITY_BASE_URL || '';
            break;
        case 'copy-trading' :
            base_url = import.meta.env.VITE_NEXT_PUBLIC_COPY_TRADING_BASE_URL || '';
            break;
        default :
            base_url = baseUrl;
    }
    axiosInstance.defaults.baseURL = base_url;
}

// Function to get auth token - can be updated to use auth context
export const getAuthToken = (): string | null => {
    // Try to get from localStorage first (for backward compatibility)
    const token = localStorage.getItem('jwtToken');
    if (token) return token;

    // Try to get from sessionStorage or other storage
    return sessionStorage.getItem('jwtToken');
};

// Function to set auth token
export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem('jwtToken', token);
        sessionStorage.setItem('jwtToken', token);
    } else {
        localStorage.removeItem('jwtToken');
        sessionStorage.removeItem('jwtToken');
    }
};

// Request Interceptor: Modify or add headers to outgoing requests
axiosInstance.interceptors.request.use(
    (config) => {
        const jwtToken = getAuthToken();
        if (jwtToken) {
            config.headers["Authorization"] = `Bearer ${jwtToken}`;
        }
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
                // Clear auth data and redirect to login
                localStorage.removeItem('user');
                localStorage.removeItem('jwtToken');
                sessionStorage.removeItem('jwtToken');
                window.location.href = '/login';
            }
            if (error?.response?.status === 403) {
                // Forbidden - user doesn't have permission
                console.error('Access forbidden:', error.response.data);
                // Could dispatch an event or show a notification
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
