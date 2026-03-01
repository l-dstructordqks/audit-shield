import axios from 'axios'
import { type ScanResult, type PackageResult, type TextScanRequest, type TrafficResult } from '../types';

// devleopment and production enviroment from .env file
const BASE_URL: string = import.meta.env.MODE === "development" 
    ? "http://localhost:8000/api/v1" 
    : import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.response.use(
    response => response,
    error => {
        const message = error.response?.data?.detail || 'Error connecting to Audit-Shield API';
        return Promise.reject(new Error(message));
    }
)


export const scanFromText = async (request: TextScanRequest): Promise<ScanResult> => {
    const response = await api.post('/scan/text', request);
    return response.data;

}

export const scanFromFile = async (file: File): Promise<ScanResult> => {
    const formData = new FormData();

    formData.append('file', file);
    const response = await api.post('/scan', formData);
    return response.data;
}

export const getPackageDetail = async(package_name: string, version: string|null = null): Promise<PackageResult> => {
    const params = version ? { version } : {};

    const response = await api.get(`/package/${package_name}`, { params });
    return response.data;
}

export const analyzeTraffic = async(file: File): Promise<TrafficResult> => {
    const formData = new FormData();

    formData.append('file', file);
    const response = await api.post('/network/analyze', formData);
    return response.data;
}

export const scanFull = async (
    requirements: File,
    traffic: File
): Promise<ScanResult> => {
    const formData = new FormData();
    formData.append('requirements', requirements);
    formData.append('traffic', traffic);
    const response = await api.post('/scan/full', formData);
    return response.data;
};