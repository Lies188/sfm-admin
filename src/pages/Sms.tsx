import { useState } from 'react';
import { Table, Button, Input, Select, Space, Modal, Form, message, Popconfirm, Tag } from 'antd';
import { SearchOutlined, SendOutlined, DeleteOutlined } from '@ant-design/icons';
import { smsService, type SmsContent, type SendSmsCommand } from '../services/sms';
import dayjs from 'dayjs';

type SmsRow = SmsContent & { key: string };

const Sms = () => {
  const [smsList, setSmsList] = useState<SmsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [current, setCurrent] = useState(1);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSearch = async () => {
    if (!phone) {
      message.warning('请输入手机号');
      return;
    }
    setLoading(true);
    setCurrent(1);
    try {
      const res = await smsService.query(phone, 200);
      setSmsList(
        (res.data || []).map((item, index) => ({
          ...item,
          key: `${item.phone}-${item.slot}-${item.reciPhone}-${item.timestamp}-${index}`,
        })),
      );
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

  const handleDelete = async () => {
    if (!phone) {
      message.warning('请先输入手机号');
      return;
    }
    try {
      // 删除两个 slot 的短信
      await Promise.all([
        smsService.deleteSlot(phone, 0),
        smsService.deleteSlot(phone, 1),
      ]);
      message.success('删除成功');
      setSmsList([]);
      setCurrent(1);
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '设备',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (p: string, r: SmsContent) => (
        <span>
          {p}
          <Tag color={r.slot === 0 ? 'blue' : 'green'} style={{ marginLeft: 4 }}>
            SIM{r.slot + 1}
          </Tag>
        </span>
      ),
    },
    { title: '发送方', dataIndex: 'reciPhone', key: 'reciPhone', width: 130 },
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
      width: 180,
      render: (ts: number) => dayjs.unix(ts).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ margin: 0 }}>短信管理</h2>
        <Button type="primary" icon={<SendOutlined />} onClick={() => setSendModalOpen(true)}>
          发送短信
        </Button>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="手机号"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: 160 }}
        />
        <Button icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
        <Popconfirm
          title="确认删除"
          description="将删除该手机号的所有短信记录"
          onConfirm={handleDelete}
          okText="确认"
          cancelText="取消"
        >
          <Button danger icon={<DeleteOutlined />}>清空记录</Button>
        </Popconfirm>
      </Space>

      <Table
        columns={columns}
        dataSource={smsList}
        rowKey="key"
        loading={loading}
        pagination={{
          current,
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: (page, size) => {
            if (size !== pageSize) {
              setPageSize(size);
              setCurrent(1);
              return;
            }
            setCurrent(page);
          },
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 600 }}
        size="middle"
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
