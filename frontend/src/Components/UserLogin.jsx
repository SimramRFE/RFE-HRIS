import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const UserLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const { username, password } = values;

    try {
      setLoading(true);
      const response = await authAPI.managerLogin({ username, password });
      
      if (response.data.success) {
        const { token } = response.data.data;
        
        // Store only manager token
        localStorage.setItem("managerToken", token);
        localStorage.setItem("managerAuth", "true");
        
        message.success("Manager login successful!");
        navigate("/manager-dashboard");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form name="managerLogin" onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="username"
        rules={[
          { required: true, message: "Please enter your username!" },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          size="large"
          placeholder="Username"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Please enter your password!" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          size="large"
          placeholder="Password"
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
        Login
      </Button>
    </Form>
  );
};

export default UserLogin;

