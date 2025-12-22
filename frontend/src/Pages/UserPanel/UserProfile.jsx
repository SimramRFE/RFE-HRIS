import React from "react";
import { Card, Descriptions, Typography, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const UserProfile = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg min-h-screen">
      <div className="mb-6">
        <Title level={3}>My Profile</Title>
      </div>

      <Card
        variant="outlined"
        style={{
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <div className="flex items-center mb-6">
          <Avatar
            size={100}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#031c4e", marginRight: 24 }}
          />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {currentUser.name || "N/A"}
            </Title>
            <p style={{ color: "#666", margin: "8px 0 0 0" }}>
              {currentUser.role || "N/A"} - {currentUser.department || "N/A"}
            </p>
          </div>
        </div>

        <Descriptions bordered column={1} size="large">
          <Descriptions.Item label="Employee ID">
            <strong>{currentUser.id || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            <strong>{currentUser.name || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Email or Username">
            <strong>{currentUser.emailOrUsername || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Mobile Number">
            <strong>{currentUser.mobileNo || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Department">
            <strong>{currentUser.department || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <strong>{currentUser.role || "N/A"}</strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default UserProfile;

