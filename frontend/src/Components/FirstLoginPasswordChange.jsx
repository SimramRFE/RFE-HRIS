import React, { useState } from "react";
import { Form, Input, Button, message, Card, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const { Title } = Typography;

const FirstLoginPasswordChange = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { oldPassword, newPassword, confirmPassword } = values;
      
      const response = await authAPI.firstLoginPasswordChange({ 
        oldPassword, 
        newPassword, 
        confirmPassword 
      });
      
      if (response.data.success) {
        message.success("Password changed successfully! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to change password. Please try again.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/gradient-hexagonal-background_23-2148944164.jpg?semt=ais_hybrid&w=740&q=80')",
      }}
    >
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-[450px] p-8 text-white">
        <div className="text-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/11284/11284777.png"
            alt="logo"
            className="w-15 mx-auto mb-2"
          />
          <Title level={2} style={{ color: "white", margin: 0 }}>
            Change Password
          </Title>
        </div>

        <Form
          form={form}
          name="firstLoginPasswordChange"
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="oldPassword"
            rules={[
              { required: true, message: "Please enter your old password!" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder="Old Password"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please enter new password!" },
              { min: 6, message: "Password must be at least 6 characters!" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder="New Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Please confirm your new password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder="Confirm New Password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            className="rounded-lg"
          >
            Change Password
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default FirstLoginPasswordChange;
