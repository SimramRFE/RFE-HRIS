import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Upload,
  Row,
  Col,
  message,
  DatePicker,
  Tabs,
  Divider,
  Space,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  PhoneOutlined,
  BankOutlined,
  FileTextOutlined,
  LaptopOutlined
} from "@ant-design/icons";
import { employeeAPI, uploadAPI } from "../../services/api";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const AddEmployeeModal = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [employeeStatus, setEmployeeStatus] = useState("Tourist");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      let uploadedDocuments = [];
      console.log('Documents from form:', values.documents);
      console.log('FileList state:', fileList);

      if (fileList && fileList.length > 0) {
        console.log('Files to upload:', fileList.length);
        const formData = new FormData();
        fileList.forEach(file => {
          console.log('File:', file);
          if (file.originFileObj) {
            formData.append('documents', file.originFileObj);
          }
        });

        try {
          console.log('Uploading documents...');
          const uploadResponse = await uploadAPI.uploadDocuments(formData);
          console.log('Upload response:', uploadResponse.data);
          if (uploadResponse.data.success) {
            uploadedDocuments = uploadResponse.data.data;
            message.success(`${uploadedDocuments.length} document(s) uploaded successfully`);
          }
        } catch (uploadError) {
          message.error('Failed to upload documents');
          console.error('Upload error:', uploadError);
        }
      } else {
        console.log('No documents to upload');
      }

      // Convert date objects to strings
      const employeeData = { ...values };

      // Add uploaded documents to employee data
      employeeData.documents = uploadedDocuments;

      // Convert dayjs dates to string format
      const dateFields = [
        'dateOfBirth', 'dateOfJoining', 'passportIssueDate', 'passportExpiryDate',
        'emiratesIdIssueDate', 'emiratesIdExpiryDate', 'residentIdExpiryDate',
        'visaIssueDate', 'visaExpiryDate', 'drivingLicenseExpiry'
      ];

      dateFields.forEach(field => {
        if (employeeData[field] && dayjs.isDayjs(employeeData[field])) {
          employeeData[field] = employeeData[field].format('YYYY-MM-DD');
        }
      });

      // Remove confirmPassword from the data
      delete employeeData.confirmPassword;

      const response = await employeeAPI.create(employeeData);

      if (response.data.success) {
        message.success("Employee added successfully!");
        form.resetFields();
        setEmployeeStatus("Tourist");
        setActiveTab("1");
        setFileList([]);
        onSuccess();
        onCancel();
      }
    } catch (error) {
      console.error('Error details:', error.response || error);
      let errorMsg = "Failed to add employee";

      if (error.response?.status === 403) {
        errorMsg = `Access denied. Only admin or HR can add employees.`;
      } else {
        errorMsg = error.response?.data?.message || "Failed to add employee";
      }

      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined /> Employee Details
        </span>
      ),
      children: (
        <>
          <Title level={5} style={{ marginTop: 0, marginBottom: 16, color: "#1a1a2e" }}>
            Basic Information
          </Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Employee Name"
                name="name"
                rules={[{ required: true, message: "Please enter employee name" }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Employee Code"
                name="employeeCode"
                rules={[{ required: true, message: "Please enter employee code" }]}
              >
                <Input placeholder="Enter employee code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mobile Number"
                name="mobileNo"
                rules={[
                  { required: true, message: "Please enter mobile number" },
                  { pattern: /^[0-9]{10}$/, message: "Enter valid 10-digit number" }
                ]}
              >
                <Input placeholder="Enter mobile number" maxLength={10} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Date of Birth"
                name="dateOfBirth"
              // rules={[{ required: true, message: "Please select date of birth" }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Date of Joining"
                name="dateOfJoining"
                rules={[{ required: true, message: "Please select joining date" }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true, message: "Please select department" }]}
              >
                <Select placeholder="Select department">
                  <Option value="HR">HR</Option>
                  <Option value="Finance">Finance</Option>
                  <Option value="IT">IT</Option>
                  <Option value="Operations">Operations</Option>
                  <Option value="Sales">Sales</Option>
                  <Option value="Marketing">Marketing</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Company"
                name="company"
                rules={[{ required: true, message: "Please select company" }]}
              >
                <Select placeholder="Select company">
                  <Option value="RFE">RFE</Option>
                  <Option value="Royal Tree">Royal Tree</Option>
                  <Option value="Royal Falcon">Royal Falcon</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Employee Status"
                name="employeeStatus"
                rules={[{ required: true, message: "Please select employee status" }]}
              >
                <Select
                  placeholder="Select status"
                  onChange={(value) => setEmployeeStatus(value)}
                >
                  <Option value="Tourist">Tourist</Option>
                  <Option value="Resident">Resident</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Employee Role"
                name="role"
                rules={[{ required: true, message: "Please enter employee role" }]}
              >
                <Input placeholder="Enter employee role" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Personal Details</Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select placeholder="Select gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Nationality"
                name="nationality"
                rules={[{ required: true, message: "Please enter nationality" }]}
              >
                <Input placeholder="Enter nationality" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Marital Status"
                name="maritalStatus"
              >
                <Select placeholder="Select marital status">
                  <Option value="Single">Single</Option>
                  <Option value="Married">Married</Option>
                  <Option value="Divorced">Divorced</Option>
                  <Option value="Widowed">Widowed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Blood Group"
                name="bloodGroup"
              >
                <Select placeholder="Select blood group">
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Alternate Email"
                name="alternateEmail"
                rules={[{ type: 'email', message: 'Please enter valid email' }]}
              >
                <Input placeholder="Enter alternate email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Current Address"
                name="currentAddress"
              >
                <TextArea rows={3} placeholder="Enter current address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Permanent Address"
                name="permanentAddress"
              >
                <TextArea rows={3} placeholder="Enter permanent address" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Employment Details</Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Job Title / Designation"
                name="jobTitle"
                rules={[{ required: true, message: "Please enter job title" }]}
              >
                <Input placeholder="Enter job title" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Salary"
                name="salary"
                rules={[{ required: true, message: "Please enter salary" }]}
              >
                <Input placeholder="Enter salary" type="number" />
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Work Location"
                name="workLocation"
              >
                <Input placeholder="Enter work location" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Reporting Manager"
                name="reportingManager"
              >
                <Input placeholder="Enter reporting manager name" />
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Reference Person"
                name="referencePerson"
              >
                <Input placeholder="Enter reference person name" />
              </Form.Item>
            </Col>
          </Row>


        </>
      )
    },
    {
      key: '2',
      label: (
        <span>
          <FileTextOutlined /> Documents & ID
        </span>
      ),
      children: (
        <>
          <Title level={5} style={{ marginTop: 0, marginBottom: 16, color: "#1a1a2e" }}>
            Passport Details
          </Title>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Passport Number"
                name="passportNumber"
              // rules={[{ required: true, message: "Please enter passport number" }]}
              >
                <Input placeholder="Enter passport number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Passport Expiry Date"
                name="passportExpiryDate"
              // rules={[{ required: true, message: "Please select expiry date" }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Passport Issue Date"
                name="passportIssueDate"
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Passport Issue Place"
                name="passportIssuePlace"
              >
                <Input placeholder="Enter passport issue place" />
              </Form.Item>
            </Col>
          </Row>

          {employeeStatus === "Resident" && (
            <>
              <Divider orientation="left">Visa ID Details</Divider>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Visa ID Number"
                    name="visaIdNumber"
                    rules={[{ required: true, message: "Please enter Visa ID number" }]}
                  >
                    <Input placeholder="Enter Visa ID number" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Visa Issue Date"
                    name="visaIssueDate"
                    rules={[{ required: true, message: "Please select issue date" }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Visa Expiry Date"
                    name="visaExpiryDate"
                    rules={[{ required: true, message: "Please select expiry date" }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Visa Type"
                    name="visaType"
                    rules={[{ required: true, message: "Please enter visa type" }]}
                  >
                    <Select placeholder="Select visa type">
                      <Option value="Tourist Visa">Tourist Visa</Option>
                      <Option value="Residence Visa">Residence Visa</Option>
                    </Select>
                  </Form.Item>
                </Col>

              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Country of Visa Issuance"
                    name="countryOfVisaIssuance"
                    rules={[{ required: true, message: "Please enter Country of Visa Issuance" }]}
                  >
                    <Select placeholder="Select Country of Visa Issuance" style={{ width: '100%' }} name="countryOfVisaIssuance" >
                      <Option value="UAE">UAE</Option>
                      <Option value="India">India</Option>
                      <Option value="USA">USA</Option>
                      <Option value="UK">UK</Option>
                      <Option value="Canada">Canada</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}


          <Divider orientation="left">Other Documents</Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Driving License Number"
                name="drivingLicenseNumber"
              >
                <Input placeholder="Enter driving license number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Driving License Expiry"
                name="drivingLicenseExpiry"
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Upload Documents"
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
              multiple
              maxCount={10}
              listType="picture"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            >
              <Button icon={<UploadOutlined />}>
                Upload Documents
              </Button>
            </Upload>
            <Typography.Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: 4 }}>
              Upload passport, visa, Emirates ID, and other relevant documents (PDF, Images, Office documents)
            </Typography.Text>
          </Form.Item>
        </>
      )
    },
    {
      key: '3',
      label: (
        <span>
          <PhoneOutlined /> Emergency Contact
        </span>
      ),
      children: (
        <>
          <Title level={5} style={{ marginTop: 0, marginBottom: 16, color: "#1a1a2e" }}>
            Emergency Contact Details
          </Title>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Father's Name"
                name="fatherName"
              // rules={[{ required: true, message: "Please enter father's name" }]}
              >
                <Input placeholder="Enter father's name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Emergency Mobile Number"
                name="emergencyMobileNumber"
                rules={[
                  // { required: true, message: "Please enter emergency contact" },
                  { pattern: /^[0-9]{10}$/, message: "Enter valid 10-digit number" }
                ]}
              >
                <Input placeholder="Enter emergency contact number" maxLength={10} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Relationship to Employee"
                name="emergencyRelationship"
              // rules={[{ required: true, message: "Please enter relationship" }]}
              >
                <Select placeholder="Select relationship">
                  <Option value="Father">Father</Option>
                  <Option value="Mother">Mother</Option>
                  <Option value="Spouse">Spouse</Option>
                  <Option value="Sibling">Sibling</Option>
                  <Option value="Friend">Friend</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Alternate Emergency Contact"
                name="alternateEmergencyContact"
                rules={[
                  { pattern: /^[0-9]{10}$/, message: "Enter valid 10-digit number" }
                ]}
              >
                <Input placeholder="Enter alternate contact number" maxLength={10} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Alternate Contact Relationship"
                name="alternateRelationship"
              >
                <Select placeholder="Select relationship">
                  <Option value="Father">Father</Option>
                  <Option value="Mother">Mother</Option>
                  <Option value="Spouse">Spouse</Option>
                  <Option value="Sibling">Sibling</Option>
                  <Option value="Friend">Friend</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </>
      )
    },
    {
      key: '4',
      label: (
        <span>
          <BankOutlined /> Bank Details
        </span>
      ),
      children: (
        <>
          <Title level={5} style={{ marginTop: 0, marginBottom: 16, color: "#1a1a2e" }}>
            Bank Account Information
          </Title>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Bank Name"
                name="bankName"
                rules={[{ required: true, message: "Please enter bank name" }]}
              >
                <Input placeholder="Enter bank name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Account Holder Name"
                name="accountHolderName"
                rules={[{ required: true, message: "Please enter account holder name" }]}
              >
                <Input placeholder="Enter account holder name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Account Number"
                name="accountNumber"
                rules={[{ required: true, message: "Please enter account number" }]}
              >
                <Input placeholder="Enter account number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="IFSC Code"
                name="ifscCode"
                rules={[{ required: true, message: "Please enter IFSC code" }]}
              >
                <Input placeholder="Enter IFSC code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Account Type"
                name="accountType"
                rules={[{ required: true, message: "Please select account type" }]}
              >
                <Select placeholder="Select account type">
                  <Option value="Savings">Savings</Option>
                  <Option value="Current">Current</Option>
                  <Option value="Salary">Salary</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Bank Branch Address"
                name="bankBranchAddress"
              >
                <TextArea rows={3} placeholder="Enter bank branch address" />
              </Form.Item>
            </Col>
          </Row>
        </>
      )
    },
    {
      key: '5',
      label: (
        <span>
          <LaptopOutlined /> IT & Access
        </span>
      ),
      children: (
        <>
          <Title level={5} style={{ marginTop: 0, marginBottom: 16, color: "#1a1a2e" }}>
            IT & Access Details
          </Title>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Office Email ID"
                name="officeEmail"
                rules={[
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="Enter office email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="System Username"
                name="systemUsername"
              >
                <Input placeholder="Enter system username" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Laptop / Device Serial Number"
                name="deviceSerialNumber"
              >
                <Input placeholder="Enter device serial number" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Notes</Divider>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label="Additional Notes"
                name="notes"
              >
                <TextArea
                  rows={4}
                  placeholder="Enter any additional notes or comments about the employee"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )
    }
  ];

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        setEmployeeStatus("Tourist");
        onCancel();
      }}
      footer={null}
      destroyOnHidden
      width={900}
      style={{ top: 20 }}
      styles={{
        body: {
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto',
          padding: "24px",
          background: "rgb(245, 245, 245)"
        },
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#1a1a2e", fontWeight: 600 }}>
          Add New Employee
        </Title>
        <Text type="secondary">Fill in the employee details across different sections</Text>
      </div>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        scrollToFirstError
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
          style={{
            marginBottom: 24
          }}
        />

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <div style={{ textAlign: "right", borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <Space>
              {activeTab !== "1" && (
                <Button
                  size="large"
                  onClick={() => {
                    const currentTab = parseInt(activeTab);
                    setActiveTab(String(currentTab - 1));
                  }}
                >
                  Previous
                </Button>
              )}
              <Button
                size="large"
                onClick={() => {
                  form.resetFields();
                  setEmployeeStatus("Tourist");
                  setActiveTab("1");
                  setFileList([]);
                  onCancel();
                }}
              >
                Cancel
              </Button>
              {activeTab !== "5" ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    const currentTab = parseInt(activeTab);
                    setActiveTab(String(currentTab + 1));
                  }}
                  style={{
                    background: "#031c4e",
                    borderColor: "#031c4e"
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  style={{
                    background: "#031c4e",
                    borderColor: "#031c4e"
                  }}
                >
                  Add Employee
                </Button>
              )}
            </Space>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;