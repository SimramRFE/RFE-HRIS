import React from "react";
import { useNavigate } from "react-router-dom";
import AddEmployeeModal from "./addEmployee";

const CreateEmployeePage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/employees");
  };

  const handleSuccess = () => {
    navigate("/employees");
  };

  return (
    <AddEmployeeModal
      open
      onCancel={handleClose}
      onSuccess={handleSuccess}
    />
  );
};

export default CreateEmployeePage;
