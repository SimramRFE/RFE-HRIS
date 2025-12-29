import React, { useState, useEffect } from "react";
import { Tabs, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import UserLogin from "./UserLogin";

const Login = () => {
  const [loginType, setLoginType] = useState("account");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkIfAdminExists();
  }, []);

  const checkIfAdminExists = async () => {
    try {
      const response = await authAPI.checkAdminExists();
      if (response.data.success) {
        setAdminExists(response.data.data.exists);
      }
    } catch (error) {
      console.error("Error checking admin existence:", error);
    }
  };

  const handleSubmit = async (values) => {
    const { username, password } = values;

    try {
      setLoading(true);
      const response = await authAPI.login({ username, password });
      
      if (response.data.success) {
        const { token, isFirstLogin } = response.data.data;
        
        // Store only token
        localStorage.setItem("token", token);
        localStorage.setItem("auth", "true");
        
        message.success("Login successful!");
        
        // Check if first-time login
        if (isFirstLogin) {
          navigate("/password-change");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
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
      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl w-[400px] p-8 text-white">
        <div className="text-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/11284/11284777.png"
            alt="logo"
            className="w-15 mx-auto mb-2"
          />
          <h1 className="text-3xl font-bold">Login</h1>
        </div>

        <Tabs
          centered
          activeKey={loginType}
          onChange={(key) => setLoginType(key)}
          className="custom-white-tabs"
          items={[
            { key: "account", label: "Admin Login" },
            { key: "manager", label: "Manager Login" },
          ]}
        />

        {loginType === "account" ? (
          <Form name="login" onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please enter your username!" }
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

            {!adminExists && (
              <div className="text-center mt-4">
                <span style={{ color: "rgba(255,255,255,0.8)" }}>
                  Don't have an account?{" "}
                  <a 
                    onClick={() => navigate("/signup")}
                    style={{ color: "white", fontWeight: "bold", textDecoration: "underline", cursor: "pointer" }}
                  >
                    Sign up here
                  </a>
                </span>
              </div>
            )}
          </Form>
        ) : (
          <UserLogin />
        )}
      </div>
    </div>
  );
};

export default Login;