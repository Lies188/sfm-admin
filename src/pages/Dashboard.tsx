import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, message } from 'antd';
import { MobileOutlined, CheckCircleOutlined, CloseCircleOutlined, MessageOutlined } from '@ant-design/icons';
import { Pie, Column } from '@ant-design/charts';
import { deviceService, type DeviceStatus } from '../services/device';

const Dashboard = () => {
  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await deviceService.getAll();
        setDevices(res.devices || []);
      } catch {
        message.error('获取数据失败');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onlineCount = devices.filter(d => d.online).length;
  const offlineCount = devices.length - onlineCount;

  const pieData = [
    { type: '在线', value: onlineCount },
    { type: '离线', value: offlineCount },
  ];

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    color: ['#52c41a', '#ff4d4f'],
    label: {
      text: 'value',
      style: { fontWeight: 'bold' },
    },
    legend: { position: 'bottom' as const },
  };

  const columnData = devices.map(d => ({
    phone: d.phone?.slice(-4) || '未知',
    status: d.online ? 1 : 0,
  }));

  const columnConfig = {
    data: columnData,
    xField: 'phone',
    yField: 'status',
    color: '#1890ff',
    label: {
      text: (d: { status: number }) => d.status ? '在线' : '离线',
      position: 'middle' as const,
    },
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>数据概览</h2>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="设备总数"
              value={devices.length}
              prefix={<MobileOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="在线设备"
              value={onlineCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="离线设备"
              value={offlineCount}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="在线率"
              value={devices.length ? ((onlineCount / devices.length) * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="设备状态分布" loading={loading}>
            <div style={{ height: 300 }}>
              {devices.length > 0 && <Pie {...pieConfig} />}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="设备状态列表" loading={loading}>
            <div style={{ height: 300 }}>
              {devices.length > 0 && <Column {...columnConfig} />}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
