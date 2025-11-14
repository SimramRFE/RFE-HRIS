import React, { useState } from "react";
import { Card, Form, Input, Button, Switch, message } from "antd";

const Settings = () => {
  const [form] = Form.useForm();
  const [notifications, setNotifications] = useState(true);

  const onFinish = (values) => {
    message.success("Settings updated successfully!");
    console.log(values);
  };

  return (
    <Card title="System Settings" bordered={false}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ companyName: "Harshu Seller Service", email: "support@harshu.com" }}
      >
        <Form.Item label="Company Name" name="companyName" rules={[{ required: true }]}>
          <Input placeholder="Enter company name" />
        </Form.Item>

        <Form.Item label="Company Email" name="email" rules={[{ type: "email" }]}>
          <Input placeholder="Enter company email" />
        </Form.Item>

        <Form.Item label="Notifications">
          <Switch checked={notifications} onChange={setNotifications} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Save Settings
        </Button>
      </Form>
    </Card>
  );
};

export default Settings;
