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
  DownloadOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { employeeAPI, uploadAPI } from "../../services/api";
import { formatDate } from "../../services/dateUtils";
import { formatPhoneNumber } from "../../services/phoneUtils";

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
        return <FilePdfOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined style={{ fontSize: 20, color: '#52c41a' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ fontSize: 20, color: '#1890ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ fontSize: 20, color: '#52c41a' }} />;
      default:
        return <FileOutlined style={{ fontSize: 20, color: '#8c8c8c' }} />;
    }
  };

  const getDocumentUrl = (file) => {
    return uploadAPI.resolveDocumentUrl(file?.url || file?.name || '');
  };

  // Handle document download
  const handleDownload = async (file) => {
    try {
      const documentUrl = getDocumentUrl(file);
      const link = window.document.createElement("a");
      link.href = documentUrl;
      link.download = file.name || "document";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    } catch (error) {
      message.error("Unable to download this file. Please re-upload and try again.");
    }
  };

  // Handle document view
  const handleView = (file) => {
    window.open(getDocumentUrl(file), '_blank');
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
              {employee.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Employee Code">
              {employee.employeeCode || employee.id}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {formatPhoneNumber(employee.mobileNo)}
            </Descriptions.Item>
            <Descriptions.Item label="Email Address">
              {employee.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth">
              {formatDate(employee.dateOfBirth)}
            </Descriptions.Item>
            <Descriptions.Item label="Date of Joining">
              {formatDate(employee.dateOfJoining)}
            </Descriptions.Item>
            <Descriptions.Item label="Department">
              {employee.department || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Company">
              {employee.company || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Employee Status">
                {employee.employeeStatus || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Employee Role">
              {employee.role || "N/A"}
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
            {/* <Descriptions.Item label="Job Title / Designation">
              {employee.jobTitle || "N/A"}
            </Descriptions.Item> */}
            <Descriptions.Item label="Salary">
              {employee.salary ? `${employee.salary.toLocaleString()}` : "N/A"}
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
              {employee.passportNumber || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Passport Issue Date">
              {formatDate(employee.passportIssueDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Passport Issue Place">
              {employee.passportIssuePlace || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Passport Expiry Date">
              {formatDate(employee.passportExpiryDate)}
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
                  {employee.visaIdNumber || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Visa Issue Date">
                  {formatDate(employee.visaIssueDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Visa Expiry Date">
                  {formatDate(employee.visaExpiryDate)}
                </Descriptions.Item>
                {/* <Descriptions.Item label="Visa Type">
                  {employee.visaType || "N/A"}
                </Descriptions.Item> */}
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
              {formatDate(employee.drivingLicenseExpiry)}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          {/* <div style={{ marginTop: 24 }}>
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
          </div> */}
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
            <Descriptions.Item label="Guardian's Name">
              {employee.guardianName || employee.fatherName || "N/A"}
          </Descriptions.Item>
            <Descriptions.Item label="Guardian's Mobile Number">
              {formatPhoneNumber(employee.guardianMobileNumber || employee.emergencyMobileNumber)}
          </Descriptions.Item>
            <Descriptions.Item label="Alternate Mobile Number">
              {formatPhoneNumber(employee.alternateGuardianMobileNumber || employee.alternateEmergencyContact)}
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
              {employee.bankName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Account Holder Name">
              {employee.accountHolderName || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Account Number">
              {employee.accountNumber || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="IBAN Number">
              {employee.ibanNumber || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="IFSC Code">
              {employee.ifscCode || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Swift Code">
              {employee.swiftCode || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Account Type">
              {employee.accountType || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Bank Branch Address">
              {employee.bankBranchAddress || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    },
  ] : [];

  return (
    <Drawer
      // title={
      //   employee && (
      //     <Space size={16}>
      //       <Avatar
      //         size={52}
      //         style={{ backgroundColor: "#031c4e" }}
      //         icon={<UserOutlined />}
      //       >
      //         {employee.name?.charAt(0)}
      //       </Avatar>
      //       <div>
      //         <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>{employee.name}</div>
      //         <Space size={12}>
      //           <Text type="secondary" style={{ fontSize: 13 }}>
      //             {employee.employeeCode || employee.id}
      //           </Text>
      //           <Tag color={employee.employeeStatus === "Resident" ? "green" : "orange"}>
      //             {employee.employeeStatus || "N/A"}
      //           </Tag>
      //         </Space>
      //       </div>
      //     </Space>
      //   )
      // }
      width={780}
      open={open}
      onClose={onClose}
      title=" "
      closable={false}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined style={{ fontSize: 18 }} />}
          onClick={onClose}
          aria-label="Close"
          style={{ marginRight: -6, marginTop: -4 }}
        />
      }
      styles={{
        header: { padding: "8px 8px 0 16px", borderBottom: "none" },
        body: { paddingTop: 0 }
      }}
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
              {/* <Space style={{ marginBottom: 16 }} size={12}>
                <FileTextOutlined style={{ color: "#1890ff", fontSize: 18 }} />
                <Text strong style={{ fontSize: 15 }}>Uploaded Documents</Text>
                <Tag color="blue">{employee.documents.length} file(s)</Tag>
              </Space> */}
              <Row gutter={[12, 12]}>
                {employee.documents.map((doc, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <Card
                      size="small"
                      hoverable
                      style={{ 
                        borderRadius: 8,
                        border: "1px solid #e8e8e8"
                      }}
                      styles={{ body: { padding: 8 } }}
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
                                fontSize: 11
                              }}
                              title={doc.name}
                            >
                              {doc.name}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 10 }}>
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