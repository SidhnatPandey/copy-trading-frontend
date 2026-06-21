import { AxiosResponse } from "axios";
import { get, post, put } from "@/services/masterService";
import { APP_API } from "@/constants/api.constant";
import { setApiBaseUrl } from "@/services/interceptor";

export const signup =  (user: any) => {
    setApiBaseUrl('core');
    return post(APP_API.register, user);
};

export const login = (user: any) => {
    setApiBaseUrl('core');
    return post(APP_API.login, user);
};

export const forgotPassword = (email: string) => {
    setApiBaseUrl('core');
    return post(APP_API.forgotPassword, { email });
};

export const resetPassword = ({ password, token }: { password: string; token: string }) => {
    setApiBaseUrl('core');
    return post(APP_API.resetPassword, { password, token });
};

export const getUser = (id: string) => {
    setApiBaseUrl('core');
    return get(`${APP_API.users}/${id}`);
};

export const updateUser = (id: string, data: any) => {
    setApiBaseUrl('core');
    return put(`${APP_API.users}/${id}`, data);
};