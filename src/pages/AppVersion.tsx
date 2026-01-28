import { useState, useEffect } from 'react';
import { Card, Form, Input, InputNumber, Switch, Button, message, Spin } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';

interface VersionInfo {
  versionCode: number;
  versionName: string;
  downloadUrl: string;
  changelog: string;
  forceUpdate: boolean;
}

const AppVersion = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchVersion = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/app/version');
      if (res.ok) {
        const data: VersionInfo = await res.json();
        form.setFieldsValue(data);
      } else {
        message.error('获取版本信息失败');
      }
    } catch {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersion();
  }, []);

  const handleSave = async (values: VersionInfo) => {
    setSaving(true);
    try {
      const res = await fetch('/api/v1/app/version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        message.success('版本信息已更新');
      } else {
        message.error('更新失败');
      }
    } catch {
      message.error('网络错误');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Card title="App 版本管理" extra={
        <Button icon={<ReloadOutlined />} onClick={fetchVersion}>刷新</Button>
      }>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ maxWidth: 500 }}
        >
          <Form.Item
            name="versionCode"
            label="版本号 (versionCode)"
            rules={[{ required: true, message: '请输入版本号' }]}
            tooltip="必须递增，App 用此判断是否有更新"
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="versionName"
            label="版本名称"
            rules={[{ required: true, message: '请输入版本名称' }]}
          >
            <Input placeholder="如: 1.9" />
          </Form.Item>

          <Form.Item
            name="downloadUrl"
            label="下载地址"
            rules={[{ required: true, message: '请输入下载地址' }]}
          >
            <Input placeholder="https://msgrelay.brrr.top/MsgRelay.apk" />
          </Form.Item>

          <Form.Item
            name="changelog"
            label="更新日志"
            rules={[{ required: true, message: '请输入更新日志' }]}
          >
            <Input.TextArea rows={3} placeholder="本次更新内容..." />
          </Form.Item>

          <Form.Item
            name="forceUpdate"
            label="强制更新"
            valuePropName="checked"
            tooltip="开启后用户无法跳过更新"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} icon={<SaveOutlined />}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default AppVersion;
