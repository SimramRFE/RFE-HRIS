import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import DashboardContent from "../Layout/DashboardContent";

import Employee from "../Pages/Employee/Employee";
import ViewEmployee from "../Pages/Employee/viewEmployee";
import TeamManager from "../Pages/TeamManager";
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
        <Route path="employees" element={<Employee />} />
        <Route path="employees/view/:id" element={<ViewEmployee />} />
        {/* <Route path="team-manager" element={<TeamManager />} /> */}
        {/* <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<Leave />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="performance" element={<Performance />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
