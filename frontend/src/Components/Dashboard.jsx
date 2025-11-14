import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import DashboardContent from "../Layout/DashboardContent";

import Employees from "../Pages/Employees";
import Attendance from "../Pages/Attendance";
import Leave from "../Pages/Leave";
import Payroll from "../Pages/Payroll";
import Performance from "../Pages/Performance";
import Profile from "../Pages/Profile";
import Settings from "../Pages/Settings";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardContent />} />
        <Route path="employees" element={<Employees />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<Leave />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="performance" element={<Performance />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
