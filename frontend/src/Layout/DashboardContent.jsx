import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Spin, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { dashboardAPI } from "../services/api";

const { Title } = Typography;

const DashboardContent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    teamManagers: 0,
    departmentStats: [],
    companyStats: [],
    statusStats: [],
    growthData: []
  });

  const handleEmployeesClick = () => {
    navigate('/dashboard/employees');
  };

  const handleTeamManagerClick = () => {
    navigate('/dashboard/team-manager');
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch dashboard statistics');
      console.error('Dashboard stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", minHeight: "100vh", background: "#f5f5f5" }}>
      <Title level={2} style={{ marginBottom: 24, color: "#1a1a2e" }}>
        Welcome to Dashboard
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Card 
                hoverable 
                onClick={handleEmployeesClick} 
                style={{ 
                  cursor: 'pointer',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
                styles={{ body: { padding: '32px' } }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>Total Employees</span>}
                  value={stats.totalEmployees}
                  valueStyle={{ color: '#fff', fontSize: 42, fontWeight: 'bold' }}
                  prefix={<UserOutlined style={{ fontSize: 36 }} />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={12} lg={12}>
              <Card 
                hoverable 
                onClick={handleTeamManagerClick}
                style={{ 
                  cursor: 'pointer',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                }}
                styles={{ body: { padding: '32px' } }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>Team Managers</span>}
                  value={stats.teamManagers}
                  valueStyle={{ color: '#fff', fontSize: 42, fontWeight: 'bold' }}
                  prefix={<TeamOutlined style={{ fontSize: 36 }} />}
                />
              </Card>
            </Col>
          </Row>

        </>
      )}
    </div>
  );
};

export default DashboardContent;
