import React from "react";
import { Table, Tag } from "antd";

const Attendance = () => {
  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Employee ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Present" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  const data = [
    { id: "E101", name: "John Doe", date: "2025-11-14", status: "Present" },
    { id: "E102", name: "Jane Smith", date: "2025-11-14", status: "Absent" },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default Attendance;
