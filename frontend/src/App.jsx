import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import FirstLoginPasswordChange from "./Components/FirstLoginPasswordChange";
import Dashboard from "./Components/Dashboard";
import UserLogin from "./Components/UserLogin";
import UserLoginPage from "./Pages/UserLoginPage";
import UserDashboardRouter from "./Components/UserDashboard";
import ManagerDashboard from "./Components/ManagerDashboard";

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth");
  return isAuth ? children : <Navigate to="/login" replace />;
};

const FirstLoginRoute = ({ children }) => {
  const isAuth = localStorage.getItem("auth");
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const ProtectedUserRoute = ({ children }) => {
  const isUserAuth = localStorage.getItem("userAuth");
  return isUserAuth ? children : <Navigate to="/user-login" replace />;
};

const ProtectedManagerRoute = ({ children }) => {
  const isManagerAuth = localStorage.getItem("managerAuth");
  return isManagerAuth ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/password-change" 
        element={
          <FirstLoginRoute>
            <FirstLoginPasswordChange />
          </FirstLoginRoute>
        } 
      />
      <Route path="/user-login" element={<UserLoginPage />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-panel/*"
        element={
          <ProtectedUserRoute>
            <UserDashboardRouter />
          </ProtectedUserRoute>
        }
      />
      <Route
        path="/manager-dashboard/*"
        element={
          <ProtectedManagerRoute>
            <ManagerDashboard />
          </ProtectedManagerRoute>
        }
      />
    </Routes>
  );
}

export default App;
