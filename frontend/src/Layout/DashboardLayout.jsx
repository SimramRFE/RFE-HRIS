import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, message } from "antd";
import {
    DashboardOutlined,
    TeamOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("User");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await authAPI.getMe();
            if (response.data.success) {
                setUsername(response.data.data.name);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            // If token is invalid, redirect to login
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
        message.success("Logged out successfully");
        navigate("/");
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sider collapsible theme="dark">
                <div className="flex flex-col items-center text-white py-4 border-b border-white/20">
                    <Link
                        to="/dashboard"
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
                        { key: "1", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
                        { key: "2", icon: <TeamOutlined />, label: <Link to="/dashboard/employees">Employees</Link> },
                        // { key: "3", icon: <UsergroupAddOutlined />, label: <Link to="/dashboard/team-manager">Team Manager</Link> },
                        // { key: "3", icon: <CalendarOutlined />, label: <Link to="/dashboard/leave">Leave</Link> },
                        // { key: "4", icon: <ClockCircleOutlined />, label: <Link to="/dashboard/attendance">Attendance</Link> },
                        // { key: "5", icon: <DollarOutlined />, label: <Link to="/dashboard/payroll">Payroll</Link> },
                        // { key: "6", icon: <TrophyOutlined />, label: <Link to="/dashboard/performance">Performance</Link> },
                        // { key: "7", icon: <UserOutlined />, label: <Link to="/dashboard/profile">Profile</Link> },
                        // { key: "8", icon: <SettingOutlined />, label: <Link to="/dashboard/settings">Settings</Link> },
                        {
                            key: "9",
                            icon: <LogoutOutlined />,
                            label: "Logout",
                            onClick: handleLogout,
                            style: {
                                marginTop: "40px",
                                backgroundColor: "#dc2626",
                                color: "white",
                                fontWeight: "600"
                            },
                            danger: true
                        }
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
                    <h1 className="text-2xl font-semibold mt-2 mb-0!">Admin Panel</h1>
                    Welcome, {username}
                </Header>
                <Content
                    style={{
                        // margin: "16px",
                        background: "#fff",
                        borderRadius: "8px",
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
