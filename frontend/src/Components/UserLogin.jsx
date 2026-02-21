import React, { useState } from "react";
import { Form, Input, Button, message, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const UserLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [isManagerSuspended, setIsManagerSuspended] = useState(false);

  const handleSubmit = async (values) => {
    const { username, password } = values;

    try {
      setLoading(true);
      setLoginError("");
      setAttemptsLeft(null);
      setIsManagerSuspended(false);
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
      const errorData = error.response?.data || {};
      const errorMsg = errorData.message || "Login failed. Please try again.";

      if (typeof errorData.attemptsLeft === "number") {
        setAttemptsLeft(errorData.attemptsLeft);
      }

      if (errorData.isSuspended) {
        setIsManagerSuspended(true);
      }

      setLoginError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form name="managerLogin" onFinish={handleSubmit} layout="vertical">
      {loginError && (
        <div className="mb-4">
          <Alert
            type="error"
            message={loginError}
            showIcon
            className={attemptsLeft !== null ? "mb-2" : ""}
          />
          {attemptsLeft !== null && !isManagerSuspended && (
            <div style={{ color: "#ff4d4f", fontSize: 22, lineHeight: 1.3 }}>
              You have {attemptsLeft} attempts left before your account gets suspended.
            </div>
          )}
        </div>
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

