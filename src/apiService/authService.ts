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

export const uploadAvatar = (id: string, fileOrForm: File | FormData) => {
    const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || '';
    const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || '';

    let file: File | null = null;
    if (fileOrForm instanceof File) file = fileOrForm as File;
    else if (fileOrForm instanceof FormData) {
        const maybeFile = fileOrForm.get('avatar') as File | null;
        if (maybeFile) file = maybeFile;
        else {
            for (const pair of (fileOrForm as FormData).entries()) {
                const val = pair[1] as any;
                if (val instanceof File) { file = val; break; }
            }
        }
    }

    if (cloudName && uploadPreset && file) {
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', uploadPreset);

        return fetch(url, { method: 'POST', body: fd })
            .then(res => res.json())
            .then(async (data) => {
                const avatarUrl = data.secure_url;
                setApiBaseUrl('core');
                return put(`${APP_API.users}/${id}`, { avatar: avatarUrl });
            });
    }
    setApiBaseUrl('core');
    if (fileOrForm instanceof FormData) {
        return post(`${APP_API.users}/${id}/avatar`, fileOrForm);
    }
    const fallbackFd = new FormData();
    if (file) fallbackFd.append('avatar', file);
    return post(`${APP_API.users}/${id}/avatar`, fallbackFd);
};