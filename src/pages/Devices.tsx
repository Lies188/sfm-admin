import { useEffect, useState } from 'react';
import { Table, Tag, Button, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { deviceService, type DeviceStatus } from '../services/device';
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
      />
    </div>
  );
};

export default Devices;
