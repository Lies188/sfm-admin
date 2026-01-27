import { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Space, Modal } from 'antd';
import { ReloadOutlined, MessageOutlined } from '@ant-design/icons';
import { deviceService, type DeviceStatus, type SlotInfo } from '../services/device';
import { smsService, type SmsContent } from '../services/sms';
import dayjs from 'dayjs';

const Devices = () => {
  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsList, setSmsList] = useState<SmsContent[]>([]);
  const [smsLoading, setSmsLoading] = useState(false);
  const [currentPhone, setCurrentPhone] = useState('');

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await deviceService.getAll();
      setDevices(res.devices || []);
    } catch {
      message.error('获取设备列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleViewSms = async (phone: string) => {
    setCurrentPhone(phone);
    setSmsModalOpen(true);
    setSmsLoading(true);
    try {
      const res = await smsService.query(phone, 100);
      setSmsList(res.data || []);
    } catch {
      message.error('获取短信失败');
    } finally {
      setSmsLoading(false);
    }
  };

  const columns = [
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    {
      title: '状态',
      dataIndex: 'online',
      key: 'online',
      render: (online: boolean) => (
        <Tag color={online ? 'green' : 'red'}>{online ? '在线' : '离线'}</Tag>
      ),
    },
    {
      title: 'SIM卡槽',
      dataIndex: 'slots',
      key: 'slots',
      render: (slots: SlotInfo[] | undefined) => {
        if (!slots || slots.length === 0) return '-';
        return (
          <Space direction="vertical" size={2}>
            {slots.map((s) => (
              <span key={s.slot} style={{ whiteSpace: 'nowrap' }}>
                <Tag color={s.subId >= 0 ? 'blue' : 'default'} style={{ margin: 0 }}>
                  SIM{s.slot + 1}
                </Tag>
                <span style={{ marginLeft: 4 }}>
                  {s.subId >= 0 ? (s.carrier || '未知') : '无卡'}
                </span>
              </span>
            ))}
          </Space>
        );
      },
    },
    {
      title: '最后活跃',
      dataIndex: 'lastSeen',
      key: 'lastSeen',
      render: (ts: number) => ts ? dayjs.unix(ts).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: unknown, record: DeviceStatus) => (
        <Button
          type="link"
          icon={<MessageOutlined />}
          onClick={() => handleViewSms(record.phone)}
        >
          短信
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>设备管理</h2>
        <Button icon={<ReloadOutlined />} onClick={fetchDevices}>刷新</Button>
      </div>
      <Table
        columns={columns}
        dataSource={devices}
        rowKey="phone"
        loading={loading}
        pagination={false}
        scroll={{ x: 560 }}
        size="middle"
      />

      <Modal
        title={`短信记录 - ${currentPhone}`}
        open={smsModalOpen}
        onCancel={() => setSmsModalOpen(false)}
        footer={null}
        width={700}
      >
        <Table
          columns={[
            {
              title: '发送方',
              dataIndex: 'reciPhone',
              key: 'reciPhone',
              width: 120,
            },
            {
              title: '内容',
              dataIndex: 'reciContent',
              key: 'reciContent',
              render: (content: string) => (
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{content}</div>
              ),
            },
            {
              title: '时间',
              dataIndex: 'timestamp',
              key: 'timestamp',
              width: 160,
              render: (ts: number) => dayjs.unix(ts).format('MM-DD HH:mm:ss'),
            },
          ]}
          dataSource={smsList}
          rowKey={(r) => `${r.reciPhone}-${r.timestamp}`}
          loading={smsLoading}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default Devices;
