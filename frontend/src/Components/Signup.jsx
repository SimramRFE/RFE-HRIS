import React, { useState } from "react";
import { Form, Input, Button, message, Card, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const { Title } = Typography;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { username, name, email, password } = values;
      
      const response = await authAPI.signup({ 
        username, 
        name, 
        email, 
        password 
      });
      
      if (response.data.success) {
        message.success("Account created successfully! Please login.");
        navigate("/login");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed. Please try again.";
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
            Create Account
          </Title>
          <Typography.Text style={{ color: "rgba(255,255,255,0.8)" }}>
            Sign up to get started
          </Typography.Text>
        </div>

        <Form
          form={form}
          name="signup"
          onFinish={handleSubmit}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please enter username!" },
              { 
                pattern: /^[a-z0-9]+$/, 
                message: "Username must be lowercase letters and numbers only!" 
              }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              size="large"
              placeholder="Username (lowercase, no spaces)"
            />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please enter your full name!" }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              size="large"
              placeholder="Full Name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              size="large"
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter password!" },
              { min: 6, message: "Password must be at least 6 characters!" }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
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
              placeholder="Confirm Password"
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
            Sign Up
          </Button>

          <div className="text-center mt-4">
            <Typography.Text style={{ color: "rgba(255,255,255,0.8)" }}>
              Already have an account?{" "}
              <Typography.Link 
                onClick={() => navigate("/login")}
                style={{ color: "white", fontWeight: "bold", textDecoration: "underline" }}
              >
                Login here
              </Typography.Link>
            </Typography.Text>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
