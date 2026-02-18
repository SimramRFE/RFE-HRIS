import React, { useState } from "react";
import { Form, Input, Button, message, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const UserLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (values) => {
    const { username, password } = values;

    try {
      setLoading(true);
      setLoginError("");
      const response = await authAPI.login({ username, password });
      
      if (response.data.success) {
        const { token, role } = response.data.data;

        if (role !== "manager") {
          message.error("Only manager account is allowed here");
          return;
        }

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("managerToken");
        sessionStorage.removeItem("managerAuth");
        sessionStorage.removeItem("manager");

        sessionStorage.setItem("managerToken", token);
        sessionStorage.setItem("managerAuth", "true");
        sessionStorage.setItem("manager", JSON.stringify(response.data.data));
        
        message.success("Manager login successful!");
        navigate("/employees");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
      setLoginError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form name="managerLogin" onFinish={handleSubmit} layout="vertical">
      {loginError && (
        <Alert
          type="error"
          message={loginError}
          showIcon
          className="mb-4"
        />
      )}
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

