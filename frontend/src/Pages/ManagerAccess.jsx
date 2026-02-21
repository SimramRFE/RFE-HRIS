import React, { useEffect, useState } from "react";
import { Card, List, Spin, Typography, message, Button, Modal, Input, Popconfirm } from "antd";
import { authAPI } from "../services/api";

const { Title } = Typography;
const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const ManagerAccess = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingManagerId, setUpdatingManagerId] = useState("");
  const [deletingManagerId, setDeletingManagerId] = useState("");
  const [resettingManagerId, setResettingManagerId] = useState("");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadManagers = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getManagers();
      if (response.data.success) {
        setManagers(response.data.data || []);
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to load managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManagers();
  }, []);

  useEffect(() => {
    const handleManagerCreated = () => {
      loadManagers();
    };

    window.addEventListener("manager-created", handleManagerCreated);

    return () => {
      window.removeEventListener("manager-created", handleManagerCreated);
    };
  }, []);

  const handleManagerStatusChange = async (managerId, checked) => {
    try {
      setUpdatingManagerId(managerId);
      await authAPI.updateManagerStatus(managerId, checked);
      setManagers((prev) =>
        prev.map((manager) =>
          manager._id === managerId ? { ...manager, isActive: checked } : manager
        )
      );
      message.success(`Manager ${checked ? "enabled" : "disabled"}`);
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to update manager status");
    } finally {
      setUpdatingManagerId("");
    }
  };

  const handleDeleteManager = async (manager) => {
    try {
      setDeletingManagerId(manager._id);
      await authAPI.deleteManager(manager._id);
      setManagers((prev) => prev.filter((item) => item._id !== manager._id));
      message.success("Manager deleted successfully");
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to delete manager");
    } finally {
      setDeletingManagerId("");
    }
  };

  const openResetPasswordModal = (manager) => {
    setSelectedManager(manager);
    setNewPassword("");
    setConfirmPassword("");
    setResetModalOpen(true);
  };

  const handleResetPassword = async () => {
    if (!selectedManager?._id) {
      return;
    }

    if (!newPassword || !confirmPassword) {
      message.error("Please enter new password and confirm password");
      return;
    }

    if (newPassword.length < 8) {
      message.error("Password must be at least 8 characters");
      return;
    }

    if (!STRONG_PASSWORD_PATTERN.test(newPassword)) {
      message.error("Password must contain uppercase, lowercase, number, and special character (@$!%*?&#)");
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error("New password and confirm password do not match");
      return;
    }

    try {
      setResettingManagerId(selectedManager._id);
      await authAPI.resetManagerPassword(selectedManager._id, {
        newPassword,
        confirmPassword,
      });
      message.success("Manager password reset successfully");
      setResetModalOpen(false);
      setSelectedManager(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to reset manager password");
    } finally {
      setResettingManagerId("");
    }
  };

  return (
    <div style={{ padding: "10px", minHeight: "100vh", background: "#f6f2f2", backgroundSize: "cover", backgroundPosition: "center" }}>
      <Card style={{ borderRadius: 10 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spin />
          </div>
        ) : (
          <>
            <List
              dataSource={managers}
              locale={{ emptyText: "No managers found" }}
              renderItem={(manager, index) => {
                const rowBusy =
                  updatingManagerId === manager._id ||
                  deletingManagerId === manager._id ||
                  resettingManagerId === manager._id;

                const isActive = !!manager.isActive;

                return (
                  <List.Item>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "80px 1fr 180px 140px 120px",
                        gap: 12,
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 18 }}>{index + 1}.</div>
                      <div style={{ fontWeight: 600, fontSize: 18 }}>{manager.username}</div>
                      <div>
                        <Button
                          color="green"
                          variant="solid"
                          loading={resettingManagerId === manager._id}
                          disabled={rowBusy}
                          onClick={() => openResetPasswordModal(manager)}
                        >
                          Reset Password
                        </Button>
                      </div>
                      <div>
                        <Popconfirm
                          title={isActive ? "Suspend Manager" : "Unsuspend Manager"}
                          description={`Are you sure you want to ${isActive ? "suspend" : "unsuspend"} ${manager.username}?`}
                          okText={isActive ? "Suspend" : "Unsuspend"}
                          cancelText="Cancel"
                          onConfirm={() => handleManagerStatusChange(manager._id, !isActive)}
                          disabled={rowBusy}
                        >
                          <Button
                            color={isActive ? "orange" : "green"}
                            variant="solid"
                            loading={updatingManagerId === manager._id}
                            disabled={rowBusy}
                          >
                            {isActive ? "Suspend" : "Unsuspend"}
                          </Button>
                        </Popconfirm>
                      </div>
                      <div>
                        <Popconfirm
                          title="Delete Manager"
                          description={`Are you sure you want to delete ${manager.username}?`}
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => handleDeleteManager(manager)}
                          disabled={rowBusy}
                        >
                          <Button
                            color="red"
                            variant="solid"
                            danger
                            loading={deletingManagerId === manager._id}
                            disabled={rowBusy}
                          >
                            Delete
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  </List.Item>
                );
              }}
            />
          </>
        )}
      </Card>

      <Modal
        title={`Reset Password${selectedManager?.username ? `: ${selectedManager.username}` : ""}`}
        open={resetModalOpen}
        onCancel={() => {
          setResetModalOpen(false);
          setSelectedManager(null);
          setNewPassword("");
          setConfirmPassword("");
        }}
        onOk={handleResetPassword}
        okText="Reset Password"
        confirmLoading={!!selectedManager?._id && resettingManagerId === selectedManager._id}
      >
        <Input.Password
          placeholder="New password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          style={{ marginBottom: 30 }}
        />
        <Input.Password
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          style={{ marginBottom: 30 }}
        />
      </Modal>
    </div>
  );
};

export default ManagerAccess;
