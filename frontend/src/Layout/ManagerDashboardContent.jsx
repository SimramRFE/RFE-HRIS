import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, Avatar, Spin, message } from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  UserOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { authAPI } from "../services/api";

const { Title, Text } = Typography;

const ManagerDashboardContent = () => {
  const [managerData, setManagerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagerData();
  }, []);

  const fetchManagerData = async () => {
    try {
      const response = await authAPI.getManagerMe();
      if (response.data.success) {
        setManagerData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching manager data:", error);
      message.error("Failed to load manager data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#f5f5f5" }}>
      <Title level={2} style={{ marginBottom: 24, color: "#1a1a2e" }}>
        Welcome, {managerData?.employeeName || "Manager"}!
      </Title>

      {/* Manager Info Card */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
        bodyStyle={{ padding: 32 }}
      >
        <Row gutter={24} align="middle">
          <Col>
            <Avatar
              size={80}
              style={{ backgroundColor: "#fff", color: "#667eea" }}
              icon={<UserOutlined />}
            />
          </Col>
          <Col flex="auto">
            <div style={{ color: "#fff" }}>
              <Title level={3} style={{ color: "#fff", margin: 0 }}>
                {managerData?.employeeName}
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                Employee Code: {managerData?.employeeCode}
              </Text>
              <br />
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                Username: @{managerData?.username}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  Team Name
                </span>
              }
              value={managerData?.teamName || "N/A"}
              valueStyle={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}
              prefix={<TeamOutlined style={{ fontSize: 32 }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  Department
                </span>
              }
              value={managerData?.department || "N/A"}
              valueStyle={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}
              prefix={<BankOutlined style={{ fontSize: 32 }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  Budget Allocated
                </span>
              }
              value={managerData?.budgetAllocated || 0}
              precision={2}
              valueStyle={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}
              prefix={<DollarOutlined style={{ fontSize: 32 }} />}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions or Additional Info */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card
            title="Quick Overview"
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text strong>Role:</Text> <Text>Team Manager</Text>
              </Col>
              <Col span={24}>
                <Text strong>Team:</Text> <Text>{managerData?.teamName}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Department:</Text> <Text>{managerData?.department}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Budget Status:</Text>{" "}
                <Text type="success">Active</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerDashboardContent;
