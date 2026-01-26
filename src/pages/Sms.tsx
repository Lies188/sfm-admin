import { useState } from 'react';
import { Table, Button, Input, Select, Space, Modal, Form, message } from 'antd';
import { SearchOutlined, SendOutlined } from '@ant-design/icons';
import { smsService, type SmsContent, type SendSmsCommand } from '../services/sms';
import dayjs from 'dayjs';

const Sms = () => {
  const [smsList, setSmsList] = useState<SmsContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [slot, setSlot] = useState(0);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSearch = async () => {
    if (!phone) {
      message.warning('请输入手机号');
      return;
    }
    setLoading(true);
    try {
      const res = await smsService.query(phone, slot, 50);
      setSmsList(res.data || []);
    } catch {
      message.error('查询失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (values: SendSmsCommand) => {
    try {
      await smsService.send(values);
      message.success('发送指令已下发');
      setSendModalOpen(false);
      form.resetFields();
    } catch {
      message.error('发送失败');
    }
  };

  const columns = [
    { title: '发送方', dataIndex: 'reciPhone', key: 'reciPhone', width: 140 },
    { title: '内容', dataIndex: 'reciContent', key: 'reciContent', ellipsis: true },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (ts: number) => dayjs.unix(ts).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>短信管理</h2>
        <Button type="primary" icon={<SendOutlined />} onClick={() => setSendModalOpen(true)}>
          发送短信
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="手机号"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: 160 }}
        />
        <Select value={slot} onChange={setSlot} style={{ width: 100 }}>
          <Select.Option value={0}>SIM1</Select.Option>
          <Select.Option value={1}>SIM2</Select.Option>
        </Select>
        <Button icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={smsList}
        rowKey={(r) => `${r.reciPhone}-${r.timestamp}`}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 500 }}
      />

      <Modal
        title="发送短信"
        open={sendModalOpen}
        onCancel={() => setSendModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSend} layout="vertical">
          <Form.Item name="phone" label="设备手机号" rules={[{ required: true }]}>
            <Input placeholder="执行发送的设备手机号" />
          </Form.Item>
          <Form.Item name="slot" label="SIM卡槽" initialValue={0}>
            <Select>
              <Select.Option value={0}>SIM1</Select.Option>
              <Select.Option value={1}>SIM2</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="targetPhone" label="目标号码" rules={[{ required: true }]}>
            <Input placeholder="短信接收方号码" />
          </Form.Item>
          <Form.Item name="content" label="短信内容" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="短信内容" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>发送</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Sms;
