import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Button, 
  Typography, 
  Descriptions, 
  message, 
  Tabs, 
  Divider, 
  Tag, 
  Avatar, 
  Space,
  Row,
  Col,
  Spin,
  Drawer,
  Card
} from "antd";
import { 
  EditOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  FileTextOutlined, 
  BankOutlined, 
  LaptopOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { employeeAPI, uploadAPI } from "../../services/api";

const { Title, Text } = Typography;

const ViewEmployee = ({ id, open, onClose }) => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && open) {
      loadEmployee();
    }
  }, [id, open]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getById(id);
      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Employee not found");
      // Don't navigate away, just show error
    } finally {
      setLoading(false);
    }
  };

  // Get file icon based on file type
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FilePdfOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined style={{ fontSize: 24, color: '#52c41a' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ fontSize: 24, color: '#52c41a' }} />;
      default:
        return <FileOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />;
    }
  };

  // Handle document download
  const handleDownload = (document) => {
    const filename = document.url.split('/').pop();
    const link = document.createElement('a');
    link.href = uploadAPI.getDocument(filename);
    link.download = document.name;
    link.target = '_blank';
    link.click();
  };

  // Handle document view
  const handleView = (document) => {
    const filename = document.url.split('/').pop();
    window.open(uploadAPI.getDocument(filename), '_blank');
  };

  const tabItems = employee ? [
    {
      key: "1",
      label: (
        <span>
          <UserOutlined /> Basic Info
        </span>
      ),
      children: (
        <div style={{ padding: "8px 4px" }}>
          <Descriptions 
            title="Basic Information" 
            bordered 
            column={1} 
            size="middle" 
            labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
            contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
          >
            <Descriptions.Item label="Employee Name">
              <strong>{employee.name || "N/A"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Employee Code">
              <strong>{employee.employeeCode || employee.id}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              <strong>{employee.mobileNo || "N/A"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Email Address">
              <strong>{employee.email || "N/A"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {employee.dateOfBirth || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Joining">
              {employee.dateOfJoining || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              <Tag color="blue">{employee.department || "N/A"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Company">
              <Tag color="purple">{employee.company || "N/A"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Employee Status">
              <Tag color={employee.employeeStatus === "Resident" ? "green" : "orange"}>
                {employee.employeeStatus || "N/A"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Employee Role">
              <strong>{employee.role || "N/A"}</strong>
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: "20px 0" }} />

          <Descriptions 
            title="Personal Details" 
            bordered 
            column={1} 
            size="middle"
            labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
            contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
          >
            <Descriptions.Item label="Gender">
              {employee.gender || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Nationality">
              {employee.nationality || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Marital Status">
              {employee.maritalStatus || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Group">
              {employee.bloodGroup || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Alternate Email">
              {employee.alternateEmail || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Current Address">
              {employee.currentAddress || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Permanent Address">
              {employee.permanentAddress || "N/A"}
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: "20px 0" }} />

          <Descriptions 
            title="Employment Details" 
            bordered 
            column={1} 
            size="middle"
            labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
            contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
          >
            <Descriptions.Item label="Job Title / Designation">
              <strong>{employee.jobTitle || "N/A"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Salary">
              <strong style={{ color: "#52c41a" }}>{employee.salary ? `$${employee.salary.toLocaleString()}` : "N/A"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Work Location">
              {employee.workLocation || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Reporting Manager">
              {employee.reportingManager || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Reference Person">
              {employee.referencePerson || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <FileTextOutlined /> Documents & ID
        </span>
      ),
      children: (
        <div style={{ padding: "8px 4px" }}>
          <Descriptions 
            title="Passport Details" 
            bordered 
            column={1} 
            size="middle"
            labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
            contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
          >
            <Descriptions.Item label="Passport Number">
              <strong>{employee.passportNumber || "N/A"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Passport Issue Date">
              {employee.passportIssueDate || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Passport Issue Place">
              {employee.passportIssuePlace || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Passport Expiry Date">
              {employee.passportExpiryDate || "N/A"}
            </Descriptions.Item>
          </Descriptions>

          {employee.employeeStatus === "Resident" && (
            <>
              <Divider style={{ margin: "20px 0" }} />
              <Descriptions 
                title="Visa ID Details" 
                bordered 
                column={1} 
                size="middle"
                labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
                contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
              >
                <Descriptions.Item label="Visa ID Number">
                  <strong>{employee.visaIdNumber || "N/A"}</strong>
                </Descriptions.Item>
                <Descriptions.Item label="Visa Issue Date">
                  {employee.visaIssueDate || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Visa Expiry Date">
                  {employee.visaExpiryDate || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Visa Type">
                  {employee.visaType || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Country of Visa Issuance">
                  {employee.countryOfVisaIssuance || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}

          <Divider style={{ margin: "20px 0" }} />

          <Descriptions 
            title="Other Documents" 
            bordered 
            column={1} 
            size="middle"
            labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
            contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
          >
            <Descriptions.Item label="Driving License Number">
              {employee.drivingLicenseNumber || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Driving License Expiry">
              {employee.drivingLicenseExpiry || "N/A"}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <div style={{ marginTop: 24 }}>
            <Title level={5}>Uploaded Documents</Title>
            {employee.documents && employee.documents.length > 0 ? (
              <Row gutter={[16, 16]}>
                {employee.documents.map((doc, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <Card
                      hoverable
                      style={{ borderRadius: 8 }}
                      styles={{ body: { padding: 16 } }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {getFileIcon(doc.name)}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                            {(doc.size / 1024).toFixed(2)} KB
                          </div>
                          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <Button
                          type="primary"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(doc)}
                          style={{ flex: 1 }}
                        >
                          Download
                        </Button>
                        <Button
                          size="small"
                          icon={<FileTextOutlined />}
                          onClick={() => handleView(doc)}
                          style={{ flex: 1 }}
                        >
                          View
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Text type="secondary">No documents uploaded</Text>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <span>
          <PhoneOutlined /> Emergency Contact
        </span>
      ),
      children: (
        <div style={{ padding: "8px 4px" }}>
          <Descriptions 
            title="Emergency Contact Details" 
            bordered 
            column={1} 
            size="middle"
            labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
            contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
          >
          <Descriptions.Item label="Father's Name">
            <strong>{employee.fatherName || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Emergency Mobile Number">
            <strong>{employee.emergencyMobileNumber || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Relationship to Employee">
            {employee.emergencyRelationship || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Alternate Emergency Contact">
            {employee.alternateEmergencyContact || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Alternate Contact Relationship">
            {employee.alternateRelationship || "N/A"}
          </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
    {
      key: "4",
      label: (
        <span>
          <BankOutlined /> Bank Details
        </span>
      ),
      children: (
        <div style={{ padding: "8px 4px" }}>
          <Descriptions 
            title="Bank Account Information" 
            bordered 
            column={1} 
            size="middle"
            labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
            contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
          >
          <Descriptions.Item label="Bank Name">
            <strong>{employee.bankName || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Account Holder Name">
            <strong>{employee.accountHolderName || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Account Number">
            <strong>{employee.accountNumber || "N/A"}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="IFSC Code">
            {employee.ifscCode || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Account Type">
            <Tag color="blue">{employee.accountType || "N/A"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Bank Branch Address">
            {employee.bankBranchAddress || "N/A"}
          </Descriptions.Item>
        </Descriptions>
        </div>
      ),
    },
    {
      key: "5",
      label: (
        <span>
          <LaptopOutlined /> IT & Access
        </span>
      ),
      children: (
        <div style={{ padding: "8px 4px" }}>
          <Descriptions 
            title="IT & Access Details" 
            bordered 
            column={1} 
            size="middle"
            labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
            contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
          >
            <Descriptions.Item label="Office Email ID">
              <strong>{employee.officeEmail || "N/A"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="System Username">
              {employee.systemUsername || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Laptop / Device Serial Number">
              {employee.deviceSerialNumber || "N/A"}
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: "20px 0" }} />

          <Descriptions 
            title="Additional Notes" 
            bordered 
            column={1} 
            size="middle"
            labelStyle={{ fontWeight: 500, width: '42%', paddingLeft: '16px' }} 
            contentStyle={{ fontWeight: 400, paddingLeft: '20px' }}
          >
            <Descriptions.Item label="Notes">
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {employee.notes || "N/A"}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
  ] : [];

  return (
    <Drawer
      title={
        employee && (
          <Space size={16}>
            <Avatar
              size={52}
              style={{ backgroundColor: "#031c4e" }}
              icon={<UserOutlined />}
            >
              {employee.name?.charAt(0)}
            </Avatar>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>{employee.name}</div>
              <Space size={12}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {employee.employeeCode || employee.id}
                </Text>
                <Tag color={employee.employeeStatus === "Resident" ? "green" : "orange"}>
                  {employee.employeeStatus || "N/A"}
                </Tag>
              </Space>
            </div>
          </Space>
        )
      }
      width={780}
      open={open}
      onClose={onClose}
      closeIcon={<CloseOutlined />}
      mask={false}
      // extra={
      //   employee && (
      //     <Button
      //       type="primary"
      //       icon={<EditOutlined />}
      //       onClick={onClose}
      //       style={{
      //         background: "#031c4e",
      //         borderColor: "#031c4e"
      //       }}
      //     >
      //       Edit
      //     </Button>
      //   )
      // }
    >
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <Spin size="large" />
        </div>
      ) : employee ? (
        <div style={{ padding: "8px 4px" }}>
          {/* Uploaded Documents Section */}
          {employee.documents && employee.documents.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <Space style={{ marginBottom: 16 }} size={12}>
                <FileTextOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                <Text strong style={{ fontSize: 15 }}>Uploaded Documents</Text>
                <Tag color="blue">{employee.documents.length} file(s)</Tag>
              </Space>
              <Row gutter={[12, 12]}>
                {employee.documents.map((doc, index) => (
                  <Col xs={24} sm={12} key={index}>
                    <Card
                      size="small"
                      hoverable
                      style={{ 
                        borderRadius: 8,
                        border: "1px solid #e8e8e8"
                      }}
                      styles={{ body: { padding: 10 } }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }} size="small">
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {getFileIcon(doc.name)}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <Text 
                              strong 
                              ellipsis 
                              style={{ 
                                display: "block",
                                fontSize: 12
                              }}
                              title={doc.name}
                            >
                              {doc.name}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : "N/A"}
                            </Text>
                          </div>
                        </div>
                        <Button
                          type="primary"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(doc)}
                          block
                          style={{
                            background: "#031c4e",
                            borderColor: "#031c4e"
                          }}
                        >
                          Download
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Employee Details Tabs */}
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            type="card"
            style={{ marginTop: 24 }}
          />
        </div>
      ) : null}
    </Drawer>
  );
};

export default ViewEmployee;