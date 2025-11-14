import React from "react";
import { Card, Row, Col } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  ProjectOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardContent = () => {
  const data = [
    { name: "Jan", employees: 40, revenue: 2400 },
    { name: "Feb", employees: 45, revenue: 2210 },
    { name: "Mar", employees: 48, revenue: 2290 },
    { name: "Apr", employees: 50, revenue: 2000 },
    { name: "May", employees: 52, revenue: 2181 },
    { name: "Jun", employees: 58, revenue: 2500 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Welcome to Dashboard </h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p>Total Employees</p>
                <h2 className="text-2xl font-semibold">120</h2>
              </div>
              <UserOutlined style={{ fontSize: 30, color: "#1890ff" }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p>Total Revenue</p>
                <h2 className="text-2xl font-semibold">₹75,000</h2>
              </div>
              <DollarOutlined style={{ fontSize: 30, color: "green" }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p>Active Projects</p>
                <h2 className="text-2xl font-semibold">8</h2>
              </div>
              <ProjectOutlined style={{ fontSize: 30, color: "orange" }} />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p>Leaves This Month</p>
                <h2 className="text-2xl font-semibold">12</h2>
              </div>
              <CalendarOutlined style={{ fontSize: 30, color: "red" }} />
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="mt-2">
        <h3 className="mb-2 text-lg font-medium">Employee Growth</h3>
        <ResponsiveContainer width="100%" height={270}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="employees"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DashboardContent;
