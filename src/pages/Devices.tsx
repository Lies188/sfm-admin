import { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { deviceService, type DeviceStatus, type SlotInfo } from '../services/device';
import dayjs from 'dayjs';

const Devices = () => {
  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  const [loading, setLoading] = useState(false);

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
              <span key={s.slot}>
                <Tag color={s.subId >= 0 ? 'blue' : 'default'}>
                  SIM{s.slot + 1}
                </Tag>
                {s.subId >= 0 ? (
                  <>
                    {s.carrier || '未知运营商'}
                    <span style={{ color: '#999', marginLeft: 4 }}>(ID:{s.subId})</span>
                  </>
                ) : '无卡'}
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
        scroll={{ x: 480 }}
        size="middle"
      />
    </div>
  );
};

export default Devices;
