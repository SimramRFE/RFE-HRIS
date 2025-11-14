import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  Typography,
  Divider,
  message,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const Employees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);

  const [employees, setEmployees] = useState([
    { id: "E101", name: "John Doe", department: "HR", role: "Manager" },
    { id: "E102", name: "Jane Smith", department: "Finance", role: "Analyst" },
    { id: "E103", name: "Ravi Kumar", department: "IT", role: "Developer" },
    { id: "E104", name: "Asha Verma", department: "Operations", role: "Executive" },
  ]);

  const [filteredData, setFilteredData] = useState(employees);

  // 🔍 Live search filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(value) ||
        emp.id.toLowerCase().includes(value) ||
        emp.department.toLowerCase().includes(value) ||
        emp.role.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // ➕ Add/Edit Employee
  const handleAddOrEditEmployee = (values) => {
    if (editingEmployee) {
      const updated = employees.map((emp) =>
        emp.id === editingEmployee.id ? { ...emp, ...values } : emp
      );
      setEmployees(updated);
      setFilteredData(updated);
      message.success("Employee updated successfully");
    } else {
      const newEmp = {
        id: `E${Math.floor(100 + Math.random() * 900)}`,
        ...values,
      };
      const updated = [...employees, newEmp];
      setEmployees(updated);
      setFilteredData(updated);
      message.success("Employee added successfully");
    }

    form.resetFields();
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  // ✏️ Edit
  const handleEdit = (record) => {
    setEditingEmployee(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // 👁 View
  const handleView = (record) => {
    setViewEmployee(record);
    setIsViewModalOpen(true);
  };

  // 🗑 Delete - open confirmation modal
  const handleDelete = (record) => {
    setDeleteEmployee(record);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    const updated = employees.filter((emp) => emp.id !== deleteEmployee.id);
    setEmployees(updated);
    setFilteredData(updated);
    message.success("Employee deleted successfully");
    setIsDeleteModalOpen(false);
    setDeleteEmployee(null);
  };

  const columns = [
    { title: "Employee ID", dataIndex: "id", key: "id", width: "15%" },
    { title: "Name", dataIndex: "name", key: "name", width: "25%" },
    { title: "Department", dataIndex: "department", key: "department", width: "20%" },
    { title: "Role", dataIndex: "role", key: "role", width: "20%" },
    {
      title: "Action",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#1677ff" }} />}
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#52c41a" }} />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Title level={3}>Employee Management</Title>
        <Space>
          <Input
            placeholder="Search employees..."
            allowClear
            onChange={handleSearch}
            style={{ width: 220 }}
          />
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
              setEditingEmployee(null);
              form.resetFields();
            }}
          >
            + Add Employee
          </Button>
        </Space>
      </div>

      <Divider />

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      </div>

      {/* Footer */}
      <div className="mt-4 text-right border-t pt-3">
        <Text type="secondary">
          Showing {filteredData.length} of {employees.length} employees
        </Text>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingEmployee ? "Edit Employee" : "Add New Employee"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleAddOrEditEmployee}>
          <Form.Item
            label="Employee Name"
            name="name"
            rules={[{ required: true, message: "Please enter employee name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department" }]}
          >
            <Select placeholder="Select department">
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
              <Option value="IT">IT</Option>
              <Option value="Operations">Operations</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please enter role" }]}
          >
            <Input placeholder="Enter role" />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button
              onClick={() => setIsModalOpen(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingEmployee ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Employee Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>,
        ]}
        centered
      >
        {viewEmployee && (
          <div>
            <p><strong>ID:</strong> {viewEmployee.id}</p>
            <p><strong>Name:</strong> {viewEmployee.name}</p>
            <p><strong>Department:</strong> {viewEmployee.department}</p>
            <p><strong>Role:</strong> {viewEmployee.role}</p>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={confirmDelete}
        okType="danger"
        okText="Delete"
        cancelText="Cancel"
        centered
      >
        {deleteEmployee && (
          <p>
            Are you sure you want to delete{" "}
            <strong>{deleteEmployee.name}</strong>?
          </p>
        )}
      </Modal>
    </div>
  );
};

export default Employees;
