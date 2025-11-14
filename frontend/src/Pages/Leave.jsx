import React from "react";
import { Table, Button, Tag } from "antd";

const Leave = () => {
  const columns = [
    { title: "Employee ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Leave Type", dataIndex: "type", key: "type" },
    { title: "From", dataIndex: "from", key: "from" },
    { title: "To", dataIndex: "to", key: "to" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Approved" ? "green" : "orange"}>{status}</Tag>
      ),
    },
  ];

  const data = [
    { id: "E103", name: "Ravi Kumar", type: "Sick Leave", from: "2025-11-10", to: "2025-11-12", status: "Approved" },
    { id: "E102", name: "Jane Smith", type: "Casual Leave", from: "2025-11-15", to: "2025-11-16", status: "Pending" },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Leave Requests</h2>
        <Button type="primary">Apply Leave</Button>
      </div>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default Leave;
