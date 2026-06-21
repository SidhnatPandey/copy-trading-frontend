import { get } from "@/services/masterService";
import { APP_API } from "@/constants/api.constant";
import { setApiBaseUrl } from "@/services/interceptor";

export const getLatestMarketData = () => {
    setApiBaseUrl('core');
    const response = get(APP_API.marketData);
    return response;
}