import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Tag,
  Space,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// TabPane is now deprecated, using items prop instead
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const UserLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [form] = Form.useForm();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Load leaves on component mount
  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = () => {
    const storedLeaves = localStorage.getItem("leaves");
    const allLeaves = storedLeaves ? JSON.parse(storedLeaves) : [];
    // Filter leaves for current user
    const userLeaves = allLeaves.filter(leave => leave.employeeId === currentUser.id);
    setLeaves(userLeaves);
  };

  const handleApplyLeave = (values) => {
    const { leaveType, dateRange, reason } = values;
    const [startDate, endDate] = dateRange;
    
    // Calculate number of days
    const daysDiff = Math.ceil((endDate.toDate() - startDate.toDate()) / (1000 * 60 * 60 * 24)) + 1;
    
    const newLeave = {
      id: Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeEmail: currentUser.emailOrUsername,
      department: currentUser.department,
      leaveType,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      numberOfDays: daysDiff,
      reason,
      status: 'pending',
      appliedDate: new Date().toISOString(),
      approvedBy: null,
      approvedDate: null,
      rejectionReason: null,
    };

    // Get existing leaves
    const storedLeaves = localStorage.getItem("leaves");
    const allLeaves = storedLeaves ? JSON.parse(storedLeaves) : [];
    
    // Add new leave
    allLeaves.push(newLeave);
    localStorage.setItem("leaves", JSON.stringify(allLeaves));
    
    // Update local state
    loadLeaves();
    
    message.success("Leave application submitted successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  const showLeaveDetails = (leave) => {
    setSelectedLeave(leave);
    setIsViewModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'approved': return <CheckCircleOutlined />;
      case 'rejected': return <CloseCircleOutlined />;
      default: return null;
    }
  };

  const columns = [
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Days',
      dataIndex: 'numberOfDays',
      key: 'numberOfDays',
      render: (days) => <span>{days} day(s)</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Applied Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      render: (date) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showLeaveDetails(record)}
        >
          View
        </Button>
      ),
    },
  ];

  const filterLeavesByStatus = (status) => {
    if (status === 'all') return leaves;
    return leaves.filter(leave => leave.status === status);
  };

  return (
    <div style={{ padding: "", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: "#1a1a2e" }} className="text-xl">Leave Management</h2>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{ borderRadius: '8px' }}
        >
          Apply for Leave
        </Button>
      </div>

      {/* Leave Tabs */}
      <Card variant="outlined" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Tabs 
          defaultActiveKey="all" 
          size="large"
          items={[
            {
              key: 'all',
              label: (
                <span>
                  <CalendarOutlined style={{ marginRight: 5 }} />
                  All Leaves ({leaves.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={filterLeavesByStatus('all')}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                />
              )
            },
            {
              key: 'pending',
              label: (
                <span>
                  <ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 5 }} />
                  Pending Leaves ({filterLeavesByStatus('pending').length})
                </span>
              ),
              children: (
                <Table
                  dataSource={filterLeavesByStatus('pending')}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                />
              )
            },
            {
              key: 'approved',
              label: (
                <span>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 5 }} />
                  Approved Leaves ({filterLeavesByStatus('approved').length})
                </span>
              ),
              children: (
                <Table
                  dataSource={filterLeavesByStatus('approved')}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                />
              )
            },
            {
              key: 'rejected',
              label: (
                <span>
                  <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 5 }} />
                  Rejected Leaves ({filterLeavesByStatus('rejected').length})
                </span>
              ),
              children: (
                <Table
                  dataSource={filterLeavesByStatus('rejected')}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Apply Leave Modal */}
      <Modal
        title={
          <span>
            <PlusOutlined style={{ marginRight: 8 }} />
            Apply for Leave
          </span>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleApplyLeave}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Leave Type"
            name="leaveType"
            rules={[{ required: true, message: 'Please select leave type!' }]}
          >
            <Select size="large" placeholder="Select leave type">
              <Select.Option value="Sick Leave">Sick Leave</Select.Option>
              <Select.Option value="Casual Leave">Casual Leave</Select.Option>
              <Select.Option value="Annual Leave">Annual Leave</Select.Option>
              <Select.Option value="Maternity Leave">Maternity Leave</Select.Option>
              <Select.Option value="Paternity Leave">Paternity Leave</Select.Option>
              <Select.Option value="Emergency Leave">Emergency Leave</Select.Option>
              <Select.Option value="Unpaid Leave">Unpaid Leave</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Leave Duration"
            name="dateRange"
            rules={[{ required: true, message: 'Please select leave duration!' }]}
          >
            <RangePicker 
              size="large" 
              style={{ width: '100%' }}
              disabledDate={(current) => current && current.toDate() < new Date().setHours(0,0,0,0)}
            />
          </Form.Item>

          <Form.Item
            label="Reason for Leave"
            name="reason"
            rules={[
              { required: true, message: 'Please provide reason for leave!' },
              { min: 10, message: 'Reason must be at least 10 characters long!' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Please provide a detailed reason for your leave request..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                Submit Application
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Leave Details Modal */}
      <Modal
        title="Leave Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedLeave && (
          <div style={{ marginTop: 20 }}>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Leave Type" span={2}>
                <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  {selectedLeave.leaveType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {new Date(selectedLeave.startDate).toLocaleDateString('en-GB')}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {new Date(selectedLeave.endDate).toLocaleDateString('en-GB')}
              </Descriptions.Item>
              <Descriptions.Item label="Number of Days">
                {selectedLeave.numberOfDays} day(s)
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedLeave.status)} icon={getStatusIcon(selectedLeave.status)}>
                  {selectedLeave.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Applied Date" span={2}>
                {new Date(selectedLeave.appliedDate).toLocaleString('en-GB')}
              </Descriptions.Item>
              <Descriptions.Item label="Reason" span={2}>
                <div style={{ 
                  background: '#f5f5f5', 
                  padding: '12px', 
                  borderRadius: '6px',
                  border: '1px solid #d9d9d9'
                }}>
                  {selectedLeave.reason}
                </div>
              </Descriptions.Item>
              {selectedLeave.approvedBy && (
                <Descriptions.Item label="Approved By" span={2}>
                  {selectedLeave.approvedBy} on {new Date(selectedLeave.approvedDate).toLocaleString('en-GB')}
                </Descriptions.Item>
              )}
              {selectedLeave.rejectionReason && (
                <Descriptions.Item label="Rejection Reason" span={2}>
                  <div style={{ 
                    background: '#fff2f0', 
                    padding: '12px', 
                    borderRadius: '6px',
                    border: '1px solid #ffccc7'
                  }}>
                    {selectedLeave.rejectionReason}
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserLeave;