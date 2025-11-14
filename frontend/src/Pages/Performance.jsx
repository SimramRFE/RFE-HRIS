import React from "react";
import { Table, Card, Progress, Tag } from "antd";

const Performance = () => {
  const data = [
    { key: 1, name: "Harsh Kumar", rating: 92, remarks: "Excellent" },
    { key: 2, name: "Divya Sharma", rating: 78, remarks: "Good" },
    { key: 3, name: "Hero Singh", rating: 66, remarks: "Average" },
  ];

  const columns = [
    { title: "Employee Name", dataIndex: "name", key: "name" },
    {
      title: "Performance Score",
      dataIndex: "rating",
      render: (score) => <Progress percent={score} status={score > 70 ? "active" : "exception"} />,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (r) => (
        <Tag color={r === "Excellent" ? "green" : r === "Good" ? "blue" : "orange"}>{r}</Tag>
      ),
    },
  ];

  return (
    <Card title="Employee Performance Overview" bordered={false}>
      <Table dataSource={data} columns={columns} pagination={false} />
    </Card>
  );
};

export default Performance;
