import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Table,
  message,
  Popconfirm,
  Tag,
  Space,
  Progress,
  Typography,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { expenseAPI } from "../services/api";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

const Budget = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const [budgetData, setBudgetData] = useState({
    budgetAllocated: 0,
    budgetUsed: 0,
    balanceRemaining: 0,
    expenses: [],
  });
  const [currentExpense, setCurrentExpense] = useState(null);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getMyBudget();
      if (response.data.success) {
        setBudgetData(response.data.data);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to fetch budget data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = () => {
    setIsEditMode(false);
    setCurrentExpense(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditExpense = (record) => {
    setIsEditMode(true);
    setCurrentExpense(record);
    form.setFieldsValue({
      description: record.description,
      amount: record.amount,
      category: record.category,
      date: dayjs(record.date),
      notes: record.notes,
    });
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await expenseAPI.deleteExpense(expenseId);
      if (response.data.success) {
        message.success("Expense deleted successfully");
        setBudgetData(response.data.data);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = {
        ...values,
        date: values.date ? values.date.toISOString() : new Date().toISOString(),
      };

      let response;
      if (isEditMode) {
        response = await expenseAPI.updateExpense(currentExpense._id, formData);
      } else {
        response = await expenseAPI.addExpense(formData);
      }

      if (response.data.success) {
        message.success(
          isEditMode ? "Expense updated successfully" : "Expense added successfully"
        );
        setBudgetData(response.data.data);
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "12%",
      render: (date) => dayjs(date).format("MMM DD, YYYY"),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "15%",
      render: (category) => {
        const colors = {
          Equipment: "blue",
          Software: "cyan",
          Training: "green",
          Travel: "orange",
          Supplies: "purple",
          Other: "default",
        };
        return <Tag color={colors[category] || "default"}>{category}</Tag>;
      },
      filters: [
        { text: "Equipment", value: "Equipment" },
        { text: "Software", value: "Software" },
        { text: "Training", value: "Training" },
        { text: "Travel", value: "Travel" },
        { text: "Supplies", value: "Supplies" },
        { text: "Other", value: "Other" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      render: (amount) => (
        <Text strong style={{ color: "#f5222d" }}>
          ${amount.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      width: "20%",
      ellipsis: true,
      render: (notes) => notes || "-",
    },
    {
      title: "Action",
      key: "action",
      width: "13%",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditExpense(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Expense"
            description="Are you sure you want to delete this expense?"
            onConfirm={() => handleDeleteExpense(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const budgetPercentage = budgetData.budgetAllocated > 0
    ? (budgetData.budgetUsed / budgetData.budgetAllocated) * 100
    : 0;

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "#ff4d4f";
    if (percentage >= 70) return "#faad14";
    return "#52c41a";
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Title level={2} style={{ margin: 0, color: "#1a1a2e" }}>
          Budget Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleAddExpense}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
          }}
        >
          Add Expense
        </Button>
      </div>

      {/* Budget Overview Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  Budget Allocated
                </span>
              }
              value={budgetData.budgetAllocated}
              precision={2}
              valueStyle={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}
              prefix={<DollarOutlined style={{ fontSize: 28 }} />}
              suffix="USD"
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(240, 147, 251, 0.3)",
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  Budget Used
                </span>
              }
              value={budgetData.budgetUsed}
              precision={2}
              valueStyle={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}
              prefix={<ShoppingOutlined style={{ fontSize: 28 }} />}
              suffix="USD"
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: 12,
              background:
                budgetData.balanceRemaining < 0
                  ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
                  : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(67, 233, 123, 0.3)",
            }}
            bodyStyle={{ padding: 24 }}
          >
            <Statistic
              title={
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                  Balance Remaining
                </span>
              }
              value={budgetData.balanceRemaining}
              precision={2}
              valueStyle={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}
              prefix={
                budgetData.balanceRemaining >= 0 ? (
                  <CheckCircleOutlined style={{ fontSize: 28 }} />
                ) : (
                  <WarningOutlined style={{ fontSize: 28 }} />
                )
              }
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      {/* Budget Progress */}
      <Card
        style={{
          borderRadius: 12,
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          Budget Usage Progress
        </Title>
        <Progress
          percent={budgetPercentage}
          strokeColor={getProgressColor(budgetPercentage)}
          format={(percent) => `${percent.toFixed(1)}%`}
          strokeWidth={20}
          style={{ fontSize: 18 }}
        />
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
          <Text>
            <strong>Used:</strong> ${budgetData.budgetUsed.toFixed(2)}
          </Text>
          <Text>
            <strong>Total:</strong> ${budgetData.budgetAllocated.toFixed(2)}
          </Text>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            Expense History ({budgetData.expenses?.length || 0})
          </span>
        }
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Table
          columns={columns}
          dataSource={budgetData.expenses}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} expenses`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="No expenses recorded yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      {/* Add/Edit Expense Modal */}
      <Modal
        title={isEditMode ? "Edit Expense" : "Add New Expense"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input placeholder="Enter expense description" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="Amount (USD)"
                rules={[
                  { required: true, message: "Please enter amount" },
                  {
                    type: "number",
                    min: 0.01,
                    message: "Amount must be greater than 0",
                  },
                ]}
              >
                <InputNumber
                  placeholder="0.00"
                  size="large"
                  style={{ width: "100%" }}
                  precision={2}
                  min={0}
                  prefix="$"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category" size="large">
                  <Select.Option value="Equipment">Equipment</Select.Option>
                  <Select.Option value="Software">Software</Select.Option>
                  <Select.Option value="Training">Training</Select.Option>
                  <Select.Option value="Travel">Travel</Select.Option>
                  <Select.Option value="Supplies">Supplies</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="date"
            label="Date"
            initialValue={dayjs()}
          >
            <DatePicker size="large" style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="notes" label="Notes (Optional)">
            <TextArea
              rows={4}
              placeholder="Add any additional notes about this expense"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? "Update Expense" : "Add Expense"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Budget;
