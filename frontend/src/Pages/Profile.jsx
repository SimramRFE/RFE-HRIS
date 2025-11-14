import React from "react";
import { Card, Avatar, Descriptions, Button } from "antd";

const Profile = () => {
  const user = {
    name: "Harsh Kumar",
    position: "HR Manager",
    email: "harsh@harshu.com",
    phone: "+91 7668431256",
    department: "Human Resources",
  };

  return (
    <Card
      title="My Profile"
      bordered={false}
      extra={<Button type="primary">Edit Profile</Button>}
    >
      <div className="flex items-center mb-4">
        <Avatar
          size={100}
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          className="mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.position}</p>
        </div>
      </div>

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Department">{user.department}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default Profile;
