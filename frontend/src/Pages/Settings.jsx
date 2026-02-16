import React, { useState } from "react";
import { Card, Form, Input, Button, Switch, message, Typography, Row, Col } from "antd";

const { Title } = Typography;

const Settings = () => {
  const [form] = Form.useForm();
  const [notifications, setNotifications] = useState(true);

  const onFinish = (values) => {
    message.success("Settings updated successfully!");
    console.log(values);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg min-h-screen">
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#1a1a2e", fontWeight: 600 }}>
          System Settings
        </Title>
      </div>

      <Card 
        variant="outlined"
        style={{
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ companyName: "RFE Technology", email: "support@rfetechnology.com" }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item 
                label={
                  <span>
                    Company Name <span style={{ color: "#ff4d4f" }}>*</span>
                  </span>
                }
                name="companyName" 
                rules={[{ required: true, message: "Please enter company name" }]}
                style={{ marginBottom: 20 }}
              >
                <Input 
                  placeholder="Enter company name"
                  style={{ 
                    borderRadius: "6px",
                    padding: "8px 12px",
                    border: "1px solid #d9d9d9"
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item 
                label="Company Email" 
                name="email" 
                rules={[{ type: "email", message: "Please enter a valid email" }]}
                style={{ marginBottom: 20 }}
              >
                <Input 
                  placeholder="Enter company email"
                  style={{ 
                    borderRadius: "6px",
                    padding: "8px 12px",
                    border: "1px solid #d9d9d9"
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            label="Notifications"
            style={{ marginBottom: 20 }}
          >
            <Switch checked={notifications} onChange={setNotifications} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <div style={{ textAlign: "center" }}>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{
                  borderRadius: "6px",
                  padding: "8px 24px",
                  height: "auto",
                  background: "#722ed1",
                  borderColor: "#722ed1"
                }}
              >
                Save Settings
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
