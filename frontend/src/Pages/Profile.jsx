import React, { useState } from "react";
import { Card, Avatar, Descriptions, Button, Modal, Form, Input, message, Typography, Row, Col } from "antd";

const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Harsh Kumar",
    position: "HR Manager",
    email: "harsh123@gmailx.com",
    phone: "+91 7668431256",
    department: "Human Resources",
  });

  const handleEdit = () => {
    form.setFieldsValue(user);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (values) => {
    setUser({ ...user, ...values });
    message.success("Profile updated successfully!");
    setIsEditModalOpen(false);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg min-h-screen">
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#1a1a2e", fontWeight: 600 }}>
          My Profile
        </Title>
      </div>

      <Card
        variant="outlined"
        extra={<Button type="primary" onClick={handleEdit}>Edit Profile</Button>}
        style={{
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
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

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnHidden
        width={700}
        style={{ top: 20 }}
        styles={{
          body: {
            padding: "24px",
            background: "#f5f5f5",
          },
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0, color: "#1a1a2e", fontWeight: 600 }}>
            Edit Profile
          </Title>
        </div>
        
        <Form 
          layout="vertical" 
          form={form} 
          onFinish={handleUpdate}
          scrollToFirstError
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    Name <span style={{ color: "#ff4d4f" }}>*</span>
                  </span>
                }
                name="name"
                rules={[{ required: true, message: "Please enter name" }]}
                style={{ marginBottom: 20 }}
              >
                <Input 
                  placeholder="Enter name" 
                  style={{ 
                    borderRadius: "6px",
                    padding: "8px 12px",
                    border: "1px solid #d9d9d9"
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    Phone Number <span style={{ color: "#ff4d4f" }}>*</span>
                  </span>
                }
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
                style={{ marginBottom: 20 }}
              >
                <Input 
                  placeholder="Enter phone number" 
                  style={{ 
                    borderRadius: "6px",
                    padding: "8px 12px",
                    border: "1px solid #d9d9d9"
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    Email <span style={{ color: "#ff4d4f" }}>*</span>
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
                style={{ marginBottom: 20 }}
              >
                <Input 
                  placeholder="Enter email" 
                  style={{ 
                    borderRadius: "6px",
                    padding: "8px 12px",
                    border: "1px solid #d9d9d9"
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    Department <span style={{ color: "#ff4d4f" }}>*</span>
                  </span>
                }
                name="department"
                rules={[{ required: true, message: "Please enter department" }]}
                style={{ marginBottom: 20 }}
              >
                <Input 
                  placeholder="Enter department" 
                  style={{ 
                    borderRadius: "6px",
                    padding: "8px 12px",
                    border: "1px solid #d9d9d9"
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Position"
                name="position"
                style={{ marginBottom: 20 }}
              >
                <Input 
                  placeholder="Enter position" 
                  style={{ 
                    borderRadius: "6px",
                    padding: "8px 12px",
                    border: "1px solid #d9d9d9"
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <div style={{ textAlign: "center" }}>
              <Button
                onClick={() => {
                  setIsEditModalOpen(false);
                  form.resetFields();
                }}
                style={{ 
                  marginRight: 12,
                  borderRadius: "6px",
                  padding: "8px 24px",
                  height: "auto"
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                style={{
                  borderRadius: "6px",
                  padding: "8px 24px",
                  height: "auto",
                  background: "#722ed1",
                  borderColor: "#722ed1"
                }}
              >
                Update Profile
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;

