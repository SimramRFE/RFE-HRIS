import React from "react";
import { Modal, Form, Input, message } from "antd";
import { authAPI } from "../services/api";

const CreateManagerModal = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const handleClose = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (values.password !== values.confirmPassword) {
        message.error("Password and confirm password do not match");
        return;
      }

      setSubmitting(true);
      await authAPI.createManager({
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      message.success("Manager created successfully");
      window.dispatchEvent(new CustomEvent("manager-created"));
      handleClose();
    } catch (error) {
      if (error?.errorFields) {
        return;
      }

      const backendMessage = error?.response?.data?.message;
      const validationMessage = error?.response?.data?.errors?.[0];
      message.error(backendMessage || validationMessage || "Failed to create manager");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Create Manager"
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="Create"
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          // rules={[{ required: true, message: "Please enter username" }]}
        >
          <Input placeholder="Enter manager username" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            // { required: true, message: "Please enter password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            // { required: true, message: "Please confirm password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateManagerModal;
