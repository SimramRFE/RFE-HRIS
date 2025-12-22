import React from "react";
import { Table, Card, Tag, Button } from "antd";

const Payroll = () => {
  const data = [
    { key: 1, name: "Harsh Kumar", month: "October 2025", salary: "₹45,000", status: "Paid" },
    { key: 2, name: "Divya Sharma", month: "October 2025", salary: "₹38,000", status: "Pending" },
  ];

  const columns = [
    { title: "Employee Name", dataIndex: "name", key: "name" },
    { title: "Month", dataIndex: "month", key: "month" },
    { title: "Salary", dataIndex: "salary", key: "salary" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) =>
        status === "Paid" ? (
          <Tag color="green">Paid</Tag>
        ) : (
          <Tag color="orange">Pending</Tag>
        ),
    },
    {
      title: "Action",
      render: () => <Button type="primary">View Slip</Button>,
    },
  ];

  return (
    <Card title="Payroll Management" variant="outlined">
      <Table dataSource={data} columns={columns} pagination={false} />
    </Card>
  );
};

export default Payroll;
