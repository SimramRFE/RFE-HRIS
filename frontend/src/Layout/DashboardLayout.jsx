import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, message, List, Checkbox, Spin, Dropdown, Button } from "antd";
import {
    PlusCircleOutlined,
    UserAddOutlined,
    UsergroupAddOutlined,
    TeamOutlined,
    LogoutOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import CreateManagerModal from "../Components/CreateManagerModal";
import AddEmployeeModal from "../Pages/Employee/addEmployee";

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("User");
    const [role, setRole] = useState("superadmin");
    const [createManagerOpen, setCreateManagerOpen] = useState(false);
    const [createEmployeeOpen, setCreateEmployeeOpen] = useState(false);
    const [managerAccessOpen, setManagerAccessOpen] = useState(false);
    const [managers, setManagers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(false);
    const [updatingManagerId, setUpdatingManagerId] = useState("");

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await authAPI.getMe();
            if (response.data.success) {
                setUsername(response.data.data.username || "User");
                setRole(response.data.data.role || "");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("auth");
        sessionStorage.removeItem("managerToken");
        sessionStorage.removeItem("manager");
        sessionStorage.removeItem("managerAuth");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
        localStorage.removeItem("managerToken");
        localStorage.removeItem("manager");
        localStorage.removeItem("managerAuth");
        message.success("Logged out successfully");
        navigate("/");
    };

    const openCreateManagerModal = () => {
        setCreateManagerOpen(true);
    };

    const openCreateEmployeeModal = () => {
        setCreateEmployeeOpen(true);
    };

    const closeCreateManagerModal = () => {
        setCreateManagerOpen(false);
    };

    const closeCreateEmployeeModal = () => {
        setCreateEmployeeOpen(false);
    };

    const handleCreateEmployeeSuccess = () => {
        setCreateEmployeeOpen(false);
        navigate("/employees", {
            state: { refreshEmployeesAt: Date.now() }
        });
    };

    const handleManagerAccessOpenChange = async (open) => {
        if (role?.toLowerCase() !== "admin") {
            return;
        }

        setManagerAccessOpen(open);
        if (!open) {
            return;
        }

        try {
            setLoadingManagers(true);
            const response = await authAPI.getManagers();
            if (response.data.success) {
                setManagers(response.data.data || []);
            }
        } catch (error) {
            message.error(error?.response?.data?.message || "Failed to load managers");
        } finally {
            setLoadingManagers(false);
        }
    };

    const handleManagerStatusChange = async (managerId, checked) => {
        try {
            setUpdatingManagerId(managerId);
            await authAPI.updateManagerStatus(managerId, checked);
            setManagers((prev) =>
                prev.map((manager) =>
                    manager._id === managerId ? { ...manager, isActive: checked } : manager
                )
            );
            message.success(`Manager ${checked ? "enabled" : "disabled"}`);
        } catch (error) {
            message.error(error?.response?.data?.message || "Failed to update manager status");
        } finally {
            setUpdatingManagerId("");
        }
    };

    const displayRole = role?.toLowerCase() === "admin" ? "SA" : "MGR";
    const panelTitle = role?.toLowerCase() === "manager" ? "Manager Panel" : "Super Admin Panel";

    const getSelectedMenuKey = () => {
        if (location.pathname.startsWith("/employees/manager")) {
            return ["4"];
        }
        if (location.pathname.startsWith("/employees")) {
            return ["2"];
        }
        return [];
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible theme="dark">
                <div className="flex flex-col items-center text-white py-2 border-b border-white/20" style={{
                    height: "52px"
                }}>
                    <Link
                        to="/employees"
                        className="flex flex-col items-center text-white hover:text-blue-400 transition"
                    >
                        <Avatar
                            size={32}
                            src="https://e7.pngegg.com/pngimages/310/332/png-clipart-computer-icons-home-house-desktop-service-home-blue-logo-thumbnail.png"
                        />
                    </Link>
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    className="sidebar-gradient-active"
                    selectedKeys={getSelectedMenuKey()}
                    style={{paddingTop:20}}
                    items={[
                        { key: "2", icon: <TeamOutlined />, label: <Link to="/employees">Employees</Link> },
                        ...(role?.toLowerCase() === "manager" || role?.toLowerCase() === "admin"
                            ? [{
                                key: "3",
                                icon: <PlusCircleOutlined />,
                                label: "Create Employee",
                                onClick: openCreateEmployeeModal,
                            }]
                            : []),
                        ...(role?.toLowerCase() !== "manager"
                            ? [{
                                key: "0",
                                icon: <UserAddOutlined />,
                                label: "Create Manager",
                                onClick: openCreateManagerModal,
                            }]
                            : []),
                        ...(role?.toLowerCase() !== "manager"
                            ? [{
                                key: "4",
                                icon: <UsergroupAddOutlined />,
                                label: <Link to="/employees/manager">Manager's Info</Link>,
                            }]
                            : []),
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

            <Layout>
                <Header
                    style={{
                        background: "#001529",
                        color: "#fff",
                        textAlign: "right",
                        padding: "0 16px",
                        height: "52px",
                        lineHeight: "52px",
                    }}
                    className="flex justify-between items-center"
                >
                    <h1 className="text-xl font-semibold m-0 leading-none">{panelTitle}</h1>
                    <Dropdown
                        trigger={["click"]}
                        open={managerAccessOpen}
                        onOpenChange={handleManagerAccessOpenChange}
                        disabled={role?.toLowerCase() !== "admin"}
                        popupRender={() => (
                            <div
                                style={{
                                    width: 320,
                                    maxHeight: 360,
                                    overflow: "auto",
                                    background: "#fff",
                                    borderRadius: 8,
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                                    padding: 8,
                                }}
                            >
                                {loadingManagers ? (
                                    <div style={{ textAlign: "center", padding: "20px" }}>
                                        <Spin />
                                    </div>
                                ) : (
                                    <List
                                        size="small"
                                        dataSource={managers}
                                        locale={{ emptyText: "No managers found" }}
                                        renderItem={(manager) => (
                                            <List.Item>
                                                <div className="flex w-full items-center gap-3">
                                                    <Checkbox
                                                        checked={!!manager.isActive}
                                                        disabled={updatingManagerId === manager._id}
                                                        onChange={(event) => handleManagerStatusChange(manager._id, event.target.checked)}
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="font-medium leading-5">{manager.username}</div>
                                                        <div className="text-xs text-gray-500 leading-4">{manager.email}</div>
                                                    </div>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </div>
                        )}
                    >
                   
                        <Button
                            className="text-base"
                            type="primary"
                            // icon={
                            //     <span
                            //         style={{
                            //             display: "inline-flex",
                            //             alignItems: "center",
                            //             justifyContent: "center",
                            //             width: 18,
                            //             height: 18,
                            //             borderRadius: 999,
                            //             background: "rgb(0, 21, 41)",
                            //         }}
                            //     >
                            //         <DownOutlined style={{ fontSize: 10, color: "#fff" }} />
                            //     </span>
                            // }
                            style={{
                                cursor: role?.toLowerCase() === "admin" ? "pointer" : "default",
                                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                border: "none",
                                color: "#fff",
                            }}
                        >
                            {username} {displayRole ? `(${displayRole})` : ""}
                        </Button>
                    </Dropdown>
                </Header>
                <CreateManagerModal
                    open={createManagerOpen}
                    onCancel={closeCreateManagerModal}
                />
                <AddEmployeeModal
                    open={createEmployeeOpen}
                    onCancel={closeCreateEmployeeModal}
                    onSuccess={handleCreateEmployeeSuccess}
                />
                <Content
                    style={{
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
