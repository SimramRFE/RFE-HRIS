import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserPanelLayout from "../Layout/UserPanelLayout";
import UserDashboard from "../Pages/UserPanel/UserDashboard";
import UserProfile from "../Pages/UserPanel/UserProfile";
import UserLeave from "../Pages/UserPanel/UserLeave";

const UserDashboardRouter = () => {
  return (
    <UserPanelLayout>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="leave" element={<UserLeave />} />
        <Route path="*" element={<Navigate to="/user-panel" replace />} />
      </Routes>
    </UserPanelLayout>
  );
};

export default UserDashboardRouter;

