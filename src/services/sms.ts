import api from './api';

export interface SmsContent {
  phone: string;
  slot: number;
  reciName: string;
  reciPhone: string;
  reciContent: string;
  timestamp: number;
}

export interface SendSmsCommand {
  phone: string;
  slot: number;
  targetPhone: string;
  content: string;
}

export const smsService = {
  query: (phone: string, slot: number, limit = 10) =>
    api.post<any, { count: number; data: SmsContent[] }>('/sms/query', { phone, slot, limit }),
  send: (cmd: SendSmsCommand) => api.post('/sms/send', cmd),
  delete: (phone: string, slot: number) => api.post('/sms/delete', { phone, slot }),
};
