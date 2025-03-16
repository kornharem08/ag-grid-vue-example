// src/services/apiService.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { PaginatedPurchaseOrders, PurchaseOrder } from '@/types/purchaseOrder';

interface ApiService {
    axiosInstance: AxiosInstance | null;
    init(): void;
    getPurchaseOrders(): Promise<AxiosResponse<PaginatedPurchaseOrders>>;
    uploadFile(file: FormData): Promise<AxiosResponse<any>>;
    //   getUserById(id: number): Promise<AxiosResponse<User>>;
    //   createUser(userData: Partial<User>): Promise<AxiosResponse<User>>;
    //   updateUser(id: number, userData: Partial<User>): Promise<AxiosResponse<User>>;
    //   deleteUser(id: number): Promise<AxiosResponse<void>>;
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

    getPurchaseOrders(): Promise<AxiosResponse<PaginatedPurchaseOrders>> {
        if (!this.axiosInstance) this.init();
        return this.axiosInstance!.get('/purchaseorders');
    },
    uploadFile(file: FormData): Promise<AxiosResponse<any>> {
        if (!this.axiosInstance) this.init();
        return this.axiosInstance!.post('/purchaseorders/import', file, {
          headers: {
            'Content-Type': 'multipart/form-data', // Dynamic header for file upload
          },
        });
      },

    //   getUserById(id: number): Promise<AxiosResponse<User>> {
    //     if (!this.axiosInstance) this.init();
    //     return this.axiosInstance!.get(`/users/${id}`);
    //   },

    //   createUser(userData: Partial<User>): Promise<AxiosResponse<User>> {
    //     if (!this.axiosInstance) this.init();
    //     return this.axiosInstance!.post('/users', userData);
    //   },

    //   updateUser(id: number, userData: Partial<User>): Promise<AxiosResponse<User>> {
    //     if (!this.axiosInstance) this.init();
    //     return this.axiosInstance!.put(`/users/${id}`, userData);
    //   },

    //   deleteUser(id: number): Promise<AxiosResponse<void>> {
    //     if (!this.axiosInstance) this.init();
    //     return this.axiosInstance!.delete(`/users/${id}`);
    //   }
};