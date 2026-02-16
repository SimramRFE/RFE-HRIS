import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, Avatar, Descriptions, Divider, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  BankOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const UserDashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const [leaveStats, setLeaveStats] = useState({
    totalApprovedLeaves: 0,
    totalPendingLeaves: 0,
    attendancePercentage: 95
  });

  const handleLeaveClick = () => {
    navigate('/user-panel/leave');
  };

  useEffect(() => {
    calculateLeaveStats();
    
    // Add window focus listener to refresh data when user comes back to dashboard
    const handleFocus = () => {
      calculateLeaveStats();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const calculateLeaveStats = () => {
    const storedLeaves = localStorage.getItem("leaves");
    const allLeaves = storedLeaves ? JSON.parse(storedLeaves) : [];
    
    // Filter leaves for current user
    const userLeaves = allLeaves.filter(leave => leave.employeeId === currentUser.id);
    
    // Count approved and pending leaves
    const approvedLeaves = userLeaves.filter(leave => leave.status === 'approved');
    const pendingLeaves = userLeaves.filter(leave => leave.status === 'pending');
    
    // Calculate total approved leave days
    const totalApprovedDays = approvedLeaves.reduce((total, leave) => total + (leave.numberOfDays || 0), 0);
    const totalPendingDays = pendingLeaves.reduce((total, leave) => total + (leave.numberOfDays || 0), 0);
    
    // Calculate attendance percentage (assuming 22 working days per month)
    // For demo: 100% - (approved leave days / total working days in current period) * 100
    const workingDaysInMonth = 22;
    const attendancePercentage = Math.max(0, Math.round(100 - (totalApprovedDays / workingDaysInMonth) * 100));
    
    setLeaveStats({
      totalApprovedLeaves: totalApprovedDays,
      totalPendingLeaves: totalPendingDays,
      attendancePercentage: attendancePercentage
    });
  };

  return (
    <div style={{ padding: "", minHeight: "100vh" }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#031c4e", marginRight: 20 }}
          />
          <div>
            <Title level={2} style={{ margin: 0, color: "#1a1a2e" }}>
              Welcome, {currentUser.name || "Employee"}
            </Title>
            <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: "16px" }}>
              {currentUser.role || "N/A"} - {currentUser.department || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={handleLeaveClick} style={{ cursor: 'pointer' }}>
            <Statistic
              title="Approved Leave Days"
              value={leaveStats.totalApprovedLeaves}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={handleLeaveClick} style={{ cursor: 'pointer' }}>
            <Badge count={leaveStats.totalPendingLeaves} offset={[10, 10]} showZero={false}>
              <Statistic
                title="Pending Leave Days"
                value={leaveStats.totalPendingLeaves}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Badge>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Attendance"
              value={leaveStats.attendancePercentage}
              suffix="%"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: leaveStats.attendancePercentage >= 90 ? "#1890ff" : leaveStats.attendancePercentage >= 80 ? "#fa8c16" : "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Salary"
              value={50000}
              prefix={<DollarOutlined />}
              suffix="₹"
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Personal Information Section */}
      <Card
        title={
          <span>
            <IdcardOutlined style={{ marginRight: 8 }} />
            Personal Information
          </span>
        }
        bordered={false}
        style={{
          background: "#f5f5f5",
          borderRadius: "8px",
          marginBottom: 24,
        }}
      >
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }} size="middle">
          <Descriptions.Item 
            label={
              <span>
                <IdcardOutlined style={{ marginRight: 4 }} />
                Employee ID
              </span>
            }
          >
            <strong>{currentUser.id || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <span>
                <UserOutlined style={{ marginRight: 4 }} />
                Full Name
              </span>
            }
          >
            <strong>{currentUser.name || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <span>
                <MailOutlined style={{ marginRight: 4 }} />
                Email/Username
              </span>
            }
          >
            <strong>{currentUser.emailOrUsername || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <span>
                <PhoneOutlined style={{ marginRight: 4 }} />
                Mobile Number
              </span>
            }
          >
            <strong>{currentUser.mobileNo || "N/A"}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Professional Information Section */}
      <Card
        title={
          <span>
            <SolutionOutlined style={{ marginRight: 8 }} />
            Professional Information
          </span>
        }
        bordered={false}
        style={{
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }} size="middle">
          <Descriptions.Item 
            label={
              <span>
                <BankOutlined style={{ marginRight: 4 }} />
                Department
              </span>
            }
          >
            <strong>{currentUser.department || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <span>
                <SolutionOutlined style={{ marginRight: 4 }} />
                Role/Position
              </span>
            }
          >
            <strong>{currentUser.role || "N/A"}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Documents Section (if available) */}
      {currentUser.documents && currentUser.documents.length > 0 && (
        <Card
          title="Documents"
          bordered={false}
          style={{
            background: "#f5f5f5",
            borderRadius: "8px",
            marginTop: 24,
          }}
        >
          <div>
            {currentUser.documents.map((doc, index) => (
              <div key={index} style={{ marginBottom: 8 }}>
                {doc.name || doc.fileName || `Document ${index + 1}`}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;

