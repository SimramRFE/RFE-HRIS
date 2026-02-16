import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Avatar,
  Statistic,
  Row,
  Col,
  Typography,
  Divider,
  Modal,
  Form,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { employeeAPI, teamManagerAPI } from "../services/api";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const TeamManager = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTeamManager, setCurrentTeamManager] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTeamManagers();
    loadEmployees();
  }, []);

  const loadTeamManagers = async () => {
    try {
      setLoading(true);
      const response = await teamManagerAPI.getAll();
      if (response.data.success) {
        setTeams(response.data.data);
        setFilteredTeams(response.data.data);
      }
    } catch (error) {
      message.error('Failed to load team managers');
      console.error('Error loading team managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      message.error('Failed to load employees');
      console.error('Error loading employees:', error);
    }
  };

  const handleSearch = (value) => {
    const filtered = teams.filter(
      (team) =>
        team.teamName.toLowerCase().includes(value.toLowerCase()) ||
        team.employee?.name.toLowerCase().includes(value.toLowerCase()) ||
        team.employee?.department.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  const handleFilterStatus = (value) => {
    if (value === "All") {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter((team) => team.status === value);
      setFilteredTeams(filtered);
    }
  };

  const handleAddTeamManager = () => {
    setIsEditMode(false);
    setCurrentTeamManager(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setCurrentTeamManager(record);
    form.setFieldsValue({
      employee: record.employee._id,
      teamName: record.teamName,
      username: record.username,
      budgetAllocated: record.budgetAllocated,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await teamManagerAPI.delete(id);
      if (response.data.success) {
        message.success('Team manager deleted successfully');
        loadTeamManagers();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete team manager');
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setCurrentTeamManager(null);
  };

  const handleModalSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Remove confirmPassword from values
      const { confirmPassword, ...teamManagerData } = values;
      
      // If editing and password is empty, remove it from update data
      if (isEditMode && !teamManagerData.password) {
        delete teamManagerData.password;
      }
      
      if (isEditMode && currentTeamManager) {
        const response = await teamManagerAPI.update(currentTeamManager._id, teamManagerData);
        if (response.data.success) {
          message.success('Team manager updated successfully');
          loadTeamManagers();
          handleModalCancel();
        }
      } else {
        const response = await teamManagerAPI.create(teamManagerData);
        if (response.data.success) {
          message.success('Team manager created successfully');
          loadTeamManagers();
          handleModalCancel();
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save team manager');
      console.error('Error saving team manager:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Employee",
      key: "employee",
      width: "25%",
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div><strong>{record.employee?.name || 'N/A'}</strong></div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.employee?.employeeCode || 'N/A'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Team Name",
      dataIndex: "teamName",
      key: "teamName",
      width: "20%",
      render: (text) => (
        <Space>
          <TeamOutlined style={{ color: "#1890ff" }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: "Department",
      key: "department",
      width: "15%",
      render: (_, record) => record.employee?.department || 'N/A',
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "10%",
    },
    {
      title: "Budget Allocated",
      dataIndex: "budgetAllocated",
      key: "budgetAllocated",
      width: "15%",
      render: (amount) => `₹${amount?.toLocaleString() || 0}`,
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Team Manager"
            description="Are you sure you want to delete this team manager?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Title level={2}>Team Manager</Title>
        <p className="text-gray-600">Manage and monitor all teams</p>
      </div>

      {/* Statistics Cards */}
      {/* <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Teams"
              value={teams.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Teams"
              value={teams.filter((t) => t.status === "Active").length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Members"
              value={teams.reduce((sum, team) => sum + team.members, 0)}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Projects"
              value={teams.reduce((sum, team) => sum + team.projects, 0)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row> */}

      {/* Main Table Card */}
      <Card>
        {/* Filters */}
        <div className="mb-4 flex justify-between items-center">
          <Space>
            <Search
              placeholder="Search teams, manager, department..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300, background: "" }}
            />
            {/* <Select
              defaultValue="All"
              style={{ width: 150 }}
              onChange={handleFilterStatus}
            >
              <Option value="All">All Status</Option>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select> */}
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTeamManager}>
            Add Team Manager
          </Button>
        </div>

        <Divider />

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredTeams}
          loading={loading}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} team managers`,
          }}
          bordered
        />
      </Card>

      {/* Add/Edit Team Manager Modal */}
      <Modal
        title={isEditMode ? "Edit Team Manager" : "Add Team Manager"}
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        width={600}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
        >
          <Form.Item
            label="Select Employee"
            name="employee"
            rules={[{ required: true, message: 'Please select an employee' }]}
          >
            <Select
              showSearch
              placeholder="Search and select employee"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {employees.map((emp) => (
                <Option key={emp._id} value={emp._id}>
                  {emp.name} - {emp.employeeCode} ({emp.department})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Team Name"
            name="teamName"
            rules={[{ required: true, message: 'Please enter team name' }]}
          >
            <Input placeholder="Enter team name" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please enter username' },
              { min: 3, message: 'Username must be at least 3 characters' }
            ]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: !isEditMode, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: !isEditMode, message: 'Please confirm password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>

          <Form.Item
            label="Budget Allocated"
            name="budgetAllocated"
            rules={[{ required: true, message: 'Please enter budget allocated' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter budget"
              min={0}
              formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/₹\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ float: 'right' }}>
              <Button onClick={handleModalCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamManager;
