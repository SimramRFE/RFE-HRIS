// import React from "react";
// import { Layout, Menu, Avatar } from "antd";
// import {
//   HomeOutlined,
//   FileOutlined,
//   MessageOutlined,
//   BellOutlined,
//   EnvironmentOutlined,
//   AreaChartOutlined,
// } from "@ant-design/icons";

// const { Sider, Content } = Layout;

// const DashboardLayout = ({ children }) => {
//   return (
//     <Layout className="h-screen">
//       {/* Sidebar */}
//       <Sider
//         width={230}
//         className="!bg-gradient-to-b from-[#000043] to-[#081371]"
//       >
//         <div className="flex flex-col items-center text-white py-6 border-b border-white/20">
//           <Avatar size={64} src="https://e7.pngegg.com/pngimages/310/332/png-clipart-computer-icons-home-house-desktop-service-home-blue-logo-thumbnail.png" />
//           <h2 className="text-lg font-semibold mt-2">JOHN DON</h2>
//         </div>

//         <Menu
//           mode="inline"
//           theme="dark"
//           defaultSelectedKeys={["1"]}
//           className="!bg-transparent text-white mt-6 font-medium"
//           items={[
//             { key: "1", icon: <HomeOutlined />, label: "Home" },
//             { key: "2", icon: <FileOutlined />, label: "Employee Files" },
//             { key: "3", icon: <MessageOutlined />, label: "Messages" },
//             { key: "4", icon: <BellOutlined />, label: "Notifications" },
//             { key: "5", icon: <EnvironmentOutlined />, label: "Locations" },
//             { key: "6", icon: <AreaChartOutlined />, label: "Reports" },
//           ]}
//         />
//       </Sider>

//       {/* Main Content */}
//       <Layout className="bg-gray-50">
//         <Content className="p-8">{children}</Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default DashboardLayout;
import React from "react";
import { Layout, Menu ,Avatar} from "antd";
import {
    DashboardOutlined,
    TeamOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined,
    TrophyOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("auth");
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
    <h2 className="text-lg font-semibold mt-2 mb-0">HRIS</h2>
  </Link>
</div>

                <Menu theme="dark" mode="inline">
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        <Link to="/dashboard">Dashboard</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<TeamOutlined />}>
                        <Link to="/dashboard/employees">Employees</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<CalendarOutlined />}>
                        <Link to="/dashboard/leave">Leave</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<ClockCircleOutlined />}>
                        <Link to="/dashboard/attendance">Attendance</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<DollarOutlined />}>
                        <Link to="/dashboard/payroll">Payroll</Link>
                    </Menu.Item>
                    <Menu.Item key="6" icon={<TrophyOutlined />}>
                        <Link to="/dashboard/performance">Performance</Link>
                    </Menu.Item>
                    <Menu.Item key="7" icon={<UserOutlined />}>
                        <Link to="/dashboard/profile">Profile</Link>
                    </Menu.Item>
                    <Menu.Item key="8" icon={<SettingOutlined />}>
                        <Link to="/dashboard/settings">Settings</Link>
                    </Menu.Item>
                    <Menu.Item
                        key="9"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        className="bg-red-600 text-white font-semibold"
                    >
                        Logout
                    </Menu.Item>
                </Menu>
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
                >
                    Welcome, user123
                </Header>
                <Content
                    style={{
                        // margin: "16px",
                        background: "#fff",
                        borderRadius: "8px",
                        // padding: "20px",
                        // minHeight: "80vh",
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
