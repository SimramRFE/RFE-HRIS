import React, { useState, useEffect } from "react";
import { Tabs, Form, Input, Button, message, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import UserLogin from "./UserLogin";

const Login = () => {
  const [loginType, setLoginType] = useState("account");
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [loginError, setLoginError] = useState("");
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
      setLoginError("");
      const response = await authAPI.login({ username, password });
      
      if (response.data.success) {
        const { token, isFirstLogin, role } = response.data.data;

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("managerToken");
        sessionStorage.removeItem("managerAuth");
        sessionStorage.removeItem("manager");

        if (role === "manager") {
          sessionStorage.setItem("managerToken", token);
          sessionStorage.setItem("managerAuth", "true");
          sessionStorage.setItem("manager", JSON.stringify(response.data.data));
          message.success("Manager login successful!");
          navigate("/employees");
          return;
        }

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("auth", "true");

        message.success("Login successful!");

        if (isFirstLogin) {
          navigate("/password-change");
        } else {
          navigate("/employees");
        }

        message.success("Login successful!");

        if (isFirstLogin) {
          navigate("/password-change");
        } else {
          navigate("/employees");
        }
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
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('/src/assets/main_bg.avif')",
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

        {loginType === "account" ? (
          <Form name="login" onFinish={handleSubmit} layout="vertical">
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