import React from "react";
import { Layout, Menu, Avatar, Button } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const UserPanelLayout = ({ children }) => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("currentUser");
    navigate("/user-login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider collapsible theme="dark">
        <div className="flex flex-col items-center text-white py-4 border-b border-white/20">
          <Link
            to="/user-panel"
            className="flex flex-col items-center text-white hover:text-blue-400 transition"
          >
            <Avatar
              size={32}
              src="https://e7.pngegg.com/pngimages/310/332/png-clipart-computer-icons-home-house-desktop-service-home-blue-logo-thumbnail.png"
            />
            <h2 className="text-2xl font-semibold mt-2! mb-0 text-red-700 ">HRIS</h2>
          </Link>

        </div>

        <Menu 
          theme="dark" 
          mode="inline"
          items={[
            { key: "1", icon: <DashboardOutlined />, label: <Link to="/user-panel">Dashboard</Link> },
            { key: "2", icon: <UserOutlined />, label: <Link to="/user-panel/profile">Profile</Link> },
            { key: "3", icon: <CalendarOutlined />, label: <Link to="/user-panel/leave">Leave</Link> },
            { key: "4", icon: <LogoutOutlined />, label: "Logout", onClick: handleLogout, className: "bg-red-600 text-white font-semibold" },
          ]}
        />
      </Sider>

      {/* Header + Content */}
      <Layout>
      
        <Header
          style={{
            background: "#001529",
            color: "#fff",
            textAlign: "right",
            padding: "0 20px",
          }}
          className="flex justify-between items-center"
        >
          <h1 className="text-2xl font-semibold mt-2 mb-0!">User Panel</h1>
          Welcome, {currentUser.name || "Employee"}
        </Header>
        <Content
          style={{
            margin: "16px",
            padding: 0,
            background: "#f0f2f5",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserPanelLayout;

