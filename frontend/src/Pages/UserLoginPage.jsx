import React from "react";
import { Form, Input, Button, message, Alert } from "antd";
import { UserOutlined, LockOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const UserLoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const { emailOrUsername, password } = values;

    // Get employees from localStorage
    const stored = localStorage.getItem("employees");
    const employees = stored ? JSON.parse(stored) : [];

    // Find employee by email/username
    const employee = employees.find(
      (emp) =>
        emp.emailOrUsername?.toLowerCase() === emailOrUsername.toLowerCase()
    );

    if (!employee) {
      message.error("Invalid email/username or password!");
      return;
    }

    // Check password
    if (employee.password !== password) {
      message.error("Invalid email/username or password!");
      return;
    }

    // Login successful
    message.success("Login successful!");
    localStorage.setItem("userAuth", "true");
    localStorage.setItem("currentUser", JSON.stringify(employee));
    navigate("/user-panel");
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
          <h1 className="text-3xl font-bold">Employee Login</h1>
        </div>

        <Alert
          message="Test Credentials"
          description={
            <div style={{ fontSize: "12px", color: "#fff" }}>
              <p style={{ margin: "4px 0" }}>Email: john.doe@hris.com</p>
              <p style={{ margin: "4px 0" }}>Password: John123!@#</p>
              <p style={{ margin: "8px 0 0 0", fontSize: "11px", opacity: 0.8 }}>
                Or use any employee credentials created in admin panel
              </p>
            </div>
          }
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{ 
            marginBottom: 20, 
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        />

        <Form name="userLogin" onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="emailOrUsername"
            rules={[
              { required: true, message: "Please enter your email or username!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              size="large"
              placeholder="Email or Username"
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
            className="rounded-lg"
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default UserLoginPage;

