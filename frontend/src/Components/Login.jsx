import React, { useState } from "react";
import { Tabs, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginType, setLoginType] = useState("account");
  const navigate = useNavigate();

  // Demo credentials
  const demoUser = {
    username: "user123",
    password: "Password@123",
  };

  const handleSubmit = (values) => {
    const { username, password } = values;

    // Validation for username
    const usernameRegex = /^[a-z0-9]+$/; // lowercase letters and numbers only
    if (!usernameRegex.test(username)) {
      message.error(
        "Username must contain only lowercase letters and numbers!"
      );
      return;
    }

    // Validation for password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      message.error(
        "Password must include uppercase, lowercase, number, special character and be at least 8 characters long!"
      );
      return;
    }

    // Check demo login
    if (
      username === demoUser.username &&
      password === demoUser.password
    ) {
      message.success("Login successful!");
      localStorage.setItem("auth", "true");
      navigate("/dashboard");
    } else {
      message.error("Invalid username or password!");
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
          className="text-white"
          items={[{ key: "account", label: "Account Login" }]}
        />

        <Form name="login" onFinish={handleSubmit} layout="vertical">
          {loginType === "account" && (
            <>
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
            </>
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="rounded-lg"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;