import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, message, Button, Spin } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  DollarOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate, Routes, Route } from "react-router-dom";
import ManagerDashboardContent from "../Layout/ManagerDashboardContent";
import Budget from "../Pages/Budget";
import { authAPI } from "../services/api";

const { Header, Sider, Content } = Layout;

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [managerData, setManagerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagerData();
  }, [navigate]);

  const fetchManagerData = async () => {
    try {
      const response = await authAPI.getManagerMe();
      if (response.data.success) {
        setManagerData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching manager data:", error);
      message.error("Failed to load manager data");
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("managerToken");
    localStorage.removeItem("manager");
    localStorage.removeItem("managerAuth");
    message.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/manager-dashboard"),
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: "My Team",
      onClick: () => navigate("/manager-dashboard/team"),
    },
    {
      key: "3",
      icon: <DollarOutlined />,
      label: "Budget",
      onClick: () => navigate("/manager-dashboard/budget"),
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/manager-dashboard/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate("/manager-dashboard/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!managerData) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: collapsed ? 16 : 20,
            fontWeight: "bold",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {collapsed ? "TM" : "Team Manager"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          style={{
            background: "transparent",
            border: "none",
          }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: "600", color: "#1a1a2e" }}>
            {managerData?.teamName || "Manager Portal"}
          </div>
          
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Avatar
                style={{ backgroundColor: "#667eea", marginRight: 12 }}
                icon={<UserOutlined />}
              />
              <div style={{ display: collapsed ? "none" : "block" }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>
                  {managerData?.employeeName || "Manager"}
                </div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  @{managerData?.username}
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: "24px 16px 0" }}>
          <Routes>
            <Route path="/" element={<ManagerDashboardContent />} />
            <Route path="/team" element={<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>My Team Content Coming Soon...</div>} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/profile" element={<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>Profile Content Coming Soon...</div>} />
            <Route path="/settings" element={<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>Settings Content Coming Soon...</div>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ManagerDashboard;
