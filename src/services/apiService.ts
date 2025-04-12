// src/services/apiService.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { PaginatedPurchaseOrders, PurchaseOrder } from '@/types/purchaseOrder';
import type {PaginatedSetting, Setting} from '@/types/setting';

interface ApiService {
    axiosInstance: AxiosInstance | null;
    init(): void;
    getPurchaseOrders(data: any): Promise<AxiosResponse<PaginatedPurchaseOrders>>;
    uploadFile(file: FormData): Promise<AxiosResponse<any>>;
    importNetwork(): Promise<AxiosResponse<PaginatedPurchaseOrders>>;
    getSettings(): Promise<AxiosResponse<PaginatedSetting>>;
}

export const apiService: ApiService = {
    axiosInstance: null,

    init(): void {
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8080',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Add auth tokens here if needed
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('API Error:', error.response || error);
                return Promise.reject(error);
            }
        );
    },

    getPurchaseOrders(data: any): Promise<AxiosResponse<PaginatedPurchaseOrders>> {
        if (!this.axiosInstance) this.init();
        return this.axiosInstance!.post('/purchaseorders', data);
    },
    uploadFile(file: FormData): Promise<AxiosResponse<any>> {
        if (!this.axiosInstance) this.init();
        return this.axiosInstance!.post('/purchaseorders/import', file, {
          headers: {
            'Content-Type': 'multipart/form-data', // Dynamic header for file upload
          },
        });
      },
    importNetwork(): Promise<AxiosResponse<PaginatedPurchaseOrders>> {
        if (!this.axiosInstance) this.init();
        return this.axiosInstance!.get('/purchaseorders/import-network');
    },
    getSettings(): Promise<AxiosResponse<PaginatedSetting>> {
        if (!this.axiosInstance) this.init();
        return this.axiosInstance!.get('/purchaseorders/setting');
    }
};