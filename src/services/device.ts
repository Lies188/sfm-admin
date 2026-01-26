import api from './api';

export interface DeviceStatus {
  phone: string;
  online: boolean;
  lastSeen: number;
}

export const deviceService = {
  getAll: () => api.get<any, { count: number; devices: DeviceStatus[] }>('/devices'),
  getStatus: (phone: string) => api.post<any, DeviceStatus>('/devices/status', { phone }),
};
