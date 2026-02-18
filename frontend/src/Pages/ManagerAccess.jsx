import React, { useEffect, useState } from "react";
import { Card, List, Checkbox, Spin, Typography, message, Button, Modal, Input, Popconfirm } from "antd";
import { authAPI } from "../services/api";
import pageBackground from "../assets/bg.jpg";

const { Title } = Typography;

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
    <div style={{ padding: "10px", minHeight: "100vh", backgroundImage: `url(${pageBackground})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <Card style={{ borderRadius: 10 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          Manager Access
        </Title>

        {loading ? (
          <div style={{ textAlign: "center", padding: 24 }}>
            <Spin />
          </div>
        ) : (
          <List
            dataSource={managers}
            locale={{ emptyText: "No managers found" }}
            renderItem={(manager) => {
              const rowBusy =
                updatingManagerId === manager._id ||
                deletingManagerId === manager._id ||
                resettingManagerId === manager._id;

              return (
              <List.Item>
                <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }} >
                  <Checkbox
                    checked={!!manager.isActive}
                    disabled={rowBusy}
                    onChange={(event) => handleManagerStatusChange(manager._id, event.target.checked)}
                  />
                  <div className="flex justify-between w-100">
                    <div>
                    <div style={{ fontWeight: 600 }}>{manager.username}</div>
                    {/* <div style={{ fontSize: 12, color: "#666" }}>{manager.email}</div> */}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
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
                          delete
                        </Button>
                      </Popconfirm>
                      <Button
                        color="green"
                        variant="solid"
                        loading={resettingManagerId === manager._id}
                        disabled={rowBusy}
                        onClick={() => openResetPasswordModal(manager)}
                      >
                        reset Password
                      </Button>
                    </div>
                  </div>
                </div>
              </List.Item>
              );
            }}
          />
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
