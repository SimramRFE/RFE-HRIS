import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";

import Employee from "../Pages/Employee/Employee";
import ViewEmployee from "../Pages/Employee/viewEmployee";
import ManagerAccess from "../Pages/ManagerAccess";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Employee />} />
        <Route path="manager" element={<ManagerAccess />} />
        <Route path="view/:id" element={<ViewEmployee />} />
        <Route path="*" element={<Navigate to="/employees" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
