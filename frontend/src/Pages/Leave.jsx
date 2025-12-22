import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  message,
  Descriptions,
  Popconfirm,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// TabPane is now deprecated, using items prop instead
const { TextArea } = Input;

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectForm] = Form.useForm();
  const currentAdmin = JSON.parse(localStorage.getItem("auth") || "{}");

  // Load leaves on component mount
  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = () => {
    const storedLeaves = localStorage.getItem("leaves");
    const allLeaves = storedLeaves ? JSON.parse(storedLeaves) : [];
    setLeaves(allLeaves);
  };

  const handleApproveLeave = (leave) => {
    const updatedLeaves = leaves.map(l =>
      l.id === leave.id
        ? {
          ...l,
          status: 'approved',
          approvedBy: 'Admin',
          approvedDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        : l
    );

    localStorage.setItem("leaves", JSON.stringify(updatedLeaves));
    setLeaves(updatedLeaves);
    message.success(`Leave application approved for ${leave.employeeName}`);
  };

  const handleRejectLeave = (values) => {
    const { rejectionReason } = values;

    const updatedLeaves = leaves.map(l =>
      l.id === selectedLeave.id
        ? {
          ...l,
          status: 'rejected',
          approvedBy: 'Admin',
          approvedDate: new Date().toISOString(),
          rejectionReason
        }
        : l
    );

    localStorage.setItem("leaves", JSON.stringify(updatedLeaves));
    setLeaves(updatedLeaves);
    message.success(`Leave application rejected for ${selectedLeave.employeeName}`);

    setIsRejectModalVisible(false);
    rejectForm.resetFields();
    setSelectedLeave(null);
  };

  const showLeaveDetails = (leave) => {
    setSelectedLeave(leave);
    setIsViewModalVisible(true);
  };

  const showRejectModal = (leave) => {
    setSelectedLeave(leave);
    setIsRejectModalVisible(true);
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
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.employeeName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.employeeId} | {record.department}
          </div>
        </div>
      ),
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => (
          <div className="flex items-center gap-1">
            <div>{new Date(record.startDate).toLocaleDateString('en-GB')} to</div>
            <div>{new Date(record.endDate).toLocaleDateString('en-GB')}</div>
            <div style={{ fontSize: '12px', color: '#666' }}  >
            ({record.numberOfDays} day{record.numberOfDays > 1 ? 's' : ''})
          </div>
        </div>
      ),
      // width: 100,
    },
    {
      title: 'Applied Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      render: (date) => new Date(date).toLocaleString('en-GB'),
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showLeaveDetails(record)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Popconfirm
                title="Approve this leave application?"
                description="Are you sure you want to approve this leave?"
                onConfirm={() => handleApproveLeave(record)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  Approve
                </Button>
              </Popconfirm>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => showRejectModal(record)}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const filterLeavesByStatus = (status) => {
    if (status === 'all') return leaves;
    return leaves.filter(leave => leave.status === status);
  };

  const getLeaveCountByStatus = (status) => {
    return filterLeavesByStatus(status).length;
  };

  return (
    <div style={{ minHeight: "100vh" }} className="p-4">
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: "#1a1a2e" }} className="text-xl">Leave Management</h2>

      </div>

      {/* Statistics Cards */}
      {/* <div style={{ marginBottom: 24, display: 'flex', gap: '16px' }}>
        <Card size="small" style={{ minWidth: 120 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
              {getLeaveCountByStatus('all')}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Leaves</div>
          </div>
        </Card>
        <Card size="small" style={{ minWidth: 120 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
              {getLeaveCountByStatus('pending')}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Pending</div>
          </div>
        </Card>
        <Card size="small" style={{ minWidth: 120 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
              {getLeaveCountByStatus('approved')}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Approved</div>
          </div>
        </Card>
        <Card size="small" style={{ minWidth: 120 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>
              {getLeaveCountByStatus('rejected')}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Rejected</div>
          </div>
        </Card>
      </div> */}

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
                  All Leaves ({getLeaveCountByStatus('all')})
                </span>
              ),
              children: (
                <Table
                  dataSource={filterLeavesByStatus('all')}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                />
              )
            },
            {
              key: 'pending',
              label: (
                <Badge count={getLeaveCountByStatus('pending')} offset={[10, 0]}>
                  <span>
                    <ClockCircleOutlined style={{ color: '#fa8c16', marginRight: 5 }} />
                    Pending Leaves
                  </span>
                </Badge>
              ),
              children: (
                <Table
                  dataSource={filterLeavesByStatus('pending')}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                />
              )
            },
            {
              key: 'approved',
              label: (
                <span>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 5 }} />
                  Approved Leaves ({getLeaveCountByStatus('approved')})
                </span>
              ),
              children: (
                <Table
                  dataSource={filterLeavesByStatus('approved')}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                />
              )
            },
            {
              key: 'rejected',
              label: (
                <span>
                  <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 5 }} />
                  Rejected Leaves ({getLeaveCountByStatus('rejected')})
                </span>
              ),
              children: (
                <Table
                  dataSource={filterLeavesByStatus('rejected')}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                />
              )
            }
          ]}
        />
      </Card>

      {/* View Leave Details Modal */}
      <Modal
        title="Leave Application Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedLeave && (
          <div style={{ marginTop: 20 }}>
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Employee Name" span={2}>
                <strong>{selectedLeave.employeeName}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Employee ID">
                {selectedLeave.employeeId}
              </Descriptions.Item>
              <Descriptions.Item label="Department">
                {selectedLeave.department}
              </Descriptions.Item>
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
                <Descriptions.Item label="Processed By" span={2}>
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

            {selectedLeave.status === 'pending' && (
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <Space>
                  <Popconfirm
                    title="Approve this leave application?"
                    description="Are you sure you want to approve this leave?"
                    onConfirm={() => {
                      handleApproveLeave(selectedLeave);
                      setIsViewModalVisible(false);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      size="large"
                      icon={<CheckOutlined />}
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                      Approve Leave
                    </Button>
                  </Popconfirm>
                  <Button
                    danger
                    size="large"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setIsViewModalVisible(false);
                      showRejectModal(selectedLeave);
                    }}
                  >
                    Reject Leave
                  </Button>
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Leave Modal */}
      <Modal
        title="Reject Leave Application"
        open={isRejectModalVisible}
        onCancel={() => {
          setIsRejectModalVisible(false);
          rejectForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <div style={{ marginTop: 20 }}>
          <p>You are about to reject the leave application for <strong>{selectedLeave?.employeeName}</strong>.</p>

          <Form
            form={rejectForm}
            layout="vertical"
            onFinish={handleRejectLeave}
          >
            <Form.Item
              label="Rejection Reason"
              name="rejectionReason"
              rules={[
                { required: true, message: 'Please provide a reason for rejection!' },
                { min: 10, message: 'Reason must be at least 10 characters long!' }
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Please provide a detailed reason for rejecting this leave application..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => {
                  setIsRejectModalVisible(false);
                  rejectForm.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" danger htmlType="submit">
                  Reject Application
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Leave;
