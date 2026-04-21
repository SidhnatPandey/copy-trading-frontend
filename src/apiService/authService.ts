import { AxiosResponse } from "axios";
import { post } from "@/services/masterService";
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

// export const forgotPassword = (email: string) => {
//     setApiBaseUrl('core');
//     return post(APP_API.forgotPassword, { email });
// };