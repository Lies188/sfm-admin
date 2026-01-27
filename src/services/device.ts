import api from './api';

export interface SlotInfo {
  slot: number;
  phone: string;
  carrier: string;
}

export interface DeviceStatus {
  phone: string;
  online: boolean;
  lastSeen: number;
  slots?: SlotInfo[];
}

export const deviceService = {
  getAll: () => api.get<any, { count: number; devices: DeviceStatus[] }>('/devices'),
  getStatus: (phone: string) => api.post<any, DeviceStatus>('/devices/status', { phone }),
};
