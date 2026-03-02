import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Card,
  Popconfirm,
  Tooltip,
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
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  PhoneOutlined,
  BankOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { employeeAPI, uploadAPI } from "../../services/api";
import { DATE_DISPLAY_FORMAT, formatDate, toDayjsDate } from "../../services/dateUtils";
import {
  combinePhoneNumber,
  COUNTRY_CODE_VALIDATION_RULE,
  PHONE_VALIDATION_RULE,
  toPhoneFormParts,
} from "../../services/phoneUtils";

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;
const DEFAULT_VISA_COUNTRIES = ["UAE", "India", "USA", "UK", "Canada"];

const EditEmployeeModal = ({ open, onCancel, onSuccess, employee }) => {
  const tabOrder = ["1", "2", "3", "4"];
  const [form] = Form.useForm();
  const [employeeStatus, setEmployeeStatus] = useState("Tourist");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [fileList, setFileList] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [editingDocumentIndex, setEditingDocumentIndex] = useState(null);
  const [editingDocumentName, setEditingDocumentName] = useState("");
  const [documentsUpdating, setDocumentsUpdating] = useState(false);
  const [visaCountryOptions, setVisaCountryOptions] = useState(DEFAULT_VISA_COUNTRIES);
  const [submitFromUpdateButton, setSubmitFromUpdateButton] = useState(false);

  const goToPreviousTab = () => {
    setSubmitFromUpdateButton(false);
    setActiveTab((previousTab) => {
      const currentIndex = tabOrder.indexOf(previousTab);
      if (currentIndex <= 0) {
        return tabOrder[0];
      }
      return tabOrder[currentIndex - 1];
    });
  };

  const goToNextTab = () => {
    setSubmitFromUpdateButton(false);
    setActiveTab((previousTab) => {
      const currentIndex = tabOrder.indexOf(previousTab);
      if (currentIndex === -1 || currentIndex >= tabOrder.length - 1) {
        return tabOrder[tabOrder.length - 1];
      }
      return tabOrder[currentIndex + 1];
    });
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const fetchVisaCountries = async () => {
      try {
        const response = await employeeAPI.getVisaCountries();
        const countriesFromApi = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        const mergedCountries = [...new Set([...DEFAULT_VISA_COUNTRIES, ...countriesFromApi])]
          .map((country) => (typeof country === "string" ? country.trim() : ""))
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        setVisaCountryOptions(mergedCountries.length ? mergedCountries : DEFAULT_VISA_COUNTRIES);
      } catch (error) {
        setVisaCountryOptions(DEFAULT_VISA_COUNTRIES);
      }
    };

    fetchVisaCountries();
  }, [open]);

  useEffect(() => {
    if (employee && open) {
      // Convert date strings to dayjs objects
      const formData = { ...employee };

      const dateFields = [
        'dateOfBirth',
        'dateOfJoining',
        'passportExpiryDate',
        'passportIssueDate',
        'emiratesIdIssueDate',
        'emiratesIdExpiryDate',
        'residentIdExpiryDate',
        'visaIssueDate',
        'visaExpiryDate',
        'drivingLicenseExpiry'
      ];

      dateFields.forEach(field => {
        if (formData[field]) {
          formData[field] = toDayjsDate(formData[field]);
        }
      });

      formData.guardianName = formData.guardianName || formData.fatherName;
      formData.guardianMobileNumber = formData.guardianMobileNumber || formData.emergencyMobileNumber;
      formData.alternateGuardianMobileNumber = formData.alternateGuardianMobileNumber || formData.alternateEmergencyContact;

      const employeeMobileParts = toPhoneFormParts(formData.mobileNo);
      formData.mobileCountryCode = employeeMobileParts.countryCode;
      formData.mobileNo = employeeMobileParts.contactNumber;

      const guardianMobileParts = toPhoneFormParts(formData.guardianMobileNumber);
      formData.guardianCountryCode = guardianMobileParts.countryCode;
      formData.guardianMobileNumber = guardianMobileParts.contactNumber;

      const alternateGuardianMobileParts = toPhoneFormParts(formData.alternateGuardianMobileNumber);
      formData.alternateGuardianCountryCode = alternateGuardianMobileParts.countryCode;
      formData.alternateGuardianMobileNumber = alternateGuardianMobileParts.contactNumber;
      formData.department = formData.department ? [formData.department] : undefined;
      formData.company = formData.company ? [formData.company] : undefined;
      formData.countryOfVisaIssuance = formData.countryOfVisaIssuance
        ? [formData.countryOfVisaIssuance]
        : undefined;

      form.setFieldsValue(formData);
      setEmployeeStatus(employee.employeeStatus || "Tourist");
      setExistingDocuments(Array.isArray(employee.documents) ? employee.documents : []);
      setEditingDocumentIndex(null);
      setEditingDocumentName("");
      setFileList([]); // Reset file list when opening modal
    }
  }, [employee, open, form]);

  const startRenameDocument = (index, currentName) => {
    setEditingDocumentIndex(index);
    setEditingDocumentName(currentName || "");
  };

  const cancelRenameDocument = () => {
    setEditingDocumentIndex(null);
    setEditingDocumentName("");
  };

  const persistDocumentsToBackend = async (documents, successMessage) => {
    if (!employee?._id && !employee?.id) {
      message.error("Employee ID not found");
      return false;
    }

    try {
      setDocumentsUpdating(true);
      const employeeId = employee._id || employee.id;
      const response = await employeeAPI.update(employeeId, { documents });

      if (response.data.success) {
        setExistingDocuments(documents);
        if (successMessage) {
          message.success(successMessage);
        }
        return true;
      }

      return false;
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update documents");
      return false;
    } finally {
      setDocumentsUpdating(false);
    }
  };

  const saveRenameDocument = async (index) => {
    const renamedDocument = editingDocumentName.trim();
    if (!renamedDocument) {
      message.warning("Document name cannot be empty");
      return;
    }

    const updatedDocuments = existingDocuments.map((document, documentIndex) =>
        documentIndex === index
          ? {
            ...document,
            name: renamedDocument,
          }
          : document
      );

    const updated = await persistDocumentsToBackend(updatedDocuments, "Document renamed successfully");
    if (updated) {
      cancelRenameDocument();
    }
  };

  const deleteDocument = async (index) => {
    const updatedDocuments = existingDocuments.filter((_, documentIndex) => documentIndex !== index);
    const updated = await persistDocumentsToBackend(updatedDocuments, "Document deleted successfully");

    if (updated && editingDocumentIndex === index) {
      cancelRenameDocument();
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!submitFromUpdateButton) {
        return;
      }

      setSubmitFromUpdateButton(false);
      setLoading(true);

      // Handle file uploads first
      let uploadedDocuments = [...existingDocuments];

      // Use fileList state instead of values.documents
      if (fileList && fileList.length > 0) {
        const newFiles = fileList.filter(file => file.originFileObj);

        if (newFiles.length > 0) {
          const formData = new FormData();
          newFiles.forEach(file => {
            formData.append('documents', file.originFileObj);
          });

          try {
            const uploadResponse = await uploadAPI.uploadDocuments(formData);
            if (uploadResponse.data.success) {
              uploadedDocuments = [...uploadedDocuments, ...uploadResponse.data.data];
            }
          } catch (uploadError) {
            message.error('Failed to upload documents');
            console.error('Upload error:', uploadError);
          }
        }
      }

      const employeeData = { ...values };

      // Add uploaded documents to employee data
      employeeData.documents = uploadedDocuments;

      // Convert dayjs objects back to strings
      const dateFields = [
        'dateOfBirth',
        'dateOfJoining',
        'passportExpiryDate',
        'passportIssueDate',
        'emiratesIdIssueDate',
        'emiratesIdExpiryDate',
        'residentIdExpiryDate',
        'visaIssueDate',
        'visaExpiryDate',
        'drivingLicenseExpiry'
      ];

      dateFields.forEach(field => {
        if (employeeData[field] && dayjs.isDayjs(employeeData[field])) {
          employeeData[field] = employeeData[field].format(DATE_DISPLAY_FORMAT);
        }
      });

      if (Array.isArray(employeeData.department)) {
        employeeData.department = employeeData.department[0] || "";
      }

      if (Array.isArray(employeeData.company)) {
        employeeData.company = employeeData.company[0] || "";
      }

      if (Array.isArray(employeeData.countryOfVisaIssuance)) {
        employeeData.countryOfVisaIssuance = employeeData.countryOfVisaIssuance[0] || "";
      }

      employeeData.fatherName = employeeData.guardianName;
      employeeData.emergencyMobileNumber = employeeData.guardianMobileNumber;
      employeeData.alternateEmergencyContact = employeeData.alternateGuardianMobileNumber;

      employeeData.mobileNo = combinePhoneNumber(employeeData.mobileCountryCode, employeeData.mobileNo);
      employeeData.emergencyMobileNumber = combinePhoneNumber(employeeData.guardianCountryCode, employeeData.emergencyMobileNumber);
      employeeData.alternateEmergencyContact = combinePhoneNumber(employeeData.alternateGuardianCountryCode, employeeData.alternateEmergencyContact);

      delete employeeData.guardianName;
      delete employeeData.guardianMobileNumber;
      delete employeeData.alternateGuardianMobileNumber;
      delete employeeData.mobileCountryCode;
      delete employeeData.guardianCountryCode;
      delete employeeData.alternateGuardianCountryCode;

      // Remove confirmPassword from the data
      delete employeeData.confirmPassword;

      const response = await employeeAPI.update(employee._id || employee.id, employeeData);

      if (response.data.success) {
        message.success("Employee updated successfully!");
        form.resetFields();
        setActiveTab("1");
        setEmployeeStatus("Tourist");
        setFileList([]);
        onSuccess();
        onCancel();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update employee";
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
          <Divider orientation="left">
            Basic Information
          </Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Employee Name"
                name="name"
              // rules={[{ required: true, message: "Please enter employee name" }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Employee Code"
                name="employeeCode"
              // rules={[{ required: true, message: "Please enter employee code" }]}
              >
                <Input placeholder="Enter employee code" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mobile Number"
                required={false}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Form.Item name="mobileCountryCode" noStyle rules={[COUNTRY_CODE_VALIDATION_RULE]}>
                    <Input placeholder="Country" prefix="+" maxLength={4} style={{ width: "28%" }} />
                  </Form.Item>
                  <Form.Item name="mobileNo" noStyle rules={[PHONE_VALIDATION_RULE]}>
                    <Input placeholder="Contact number" style={{ width: "72%" }} />
                  </Form.Item>
                </Space.Compact>
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
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Date of Joining"
                name="dateOfJoining"
              // rules={[{ required: true, message: "Please select joining date" }]}
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
                normalize={(value) => (Array.isArray(value) ? value[0] : value)}
              // rules={[{ required: true, message: "Please select department" }]}
              >
                <Select
                  mode="tags"
                  maxCount={1}
                  placeholder="Select or type department"
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
                  options={[
                    { value: "HR", label: "HR" },
                    { value: "Finance", label: "Finance" },
                    { value: "IT", label: "IT" },
                    { value: "Operations", label: "Operations" },
                    { value: "Sales", label: "Sales" },
                    { value: "Marketing", label: "Marketing" },
                  ]}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Company"
                name="company"
                normalize={(value) => (Array.isArray(value) ? value[0] : value)}
              // rules={[{ required: true, message: "Please select company" }]}
              >
                <Select
                  mode="tags"
                  maxCount={1}
                  placeholder="Select or type company"
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
                  options={[
                    { value: "Royal Falcon", label: "Royal Falcon" },
                    { value: "Royal Tree", label: "Royal Tree" },
                    { value: "Royal Grid", label: "Royal Grid" },
                    { value: "Royal Net", label: "Royal Net" },
                    { value: "SoftEx", label: "SoftEx" },
                  ]}
                >
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Employee Status"
                name="employeeStatus"
              // rules={[{ required: true, message: "Please select employee status" }]}
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
              // rules={[{ required: true, message: "Please enter employee role" }]}
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
              // rules={[{ required: true, message: "Please select gender" }]}
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
              // rules={[{ required: true, message: "Please enter nationality" }]}
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
            <Col xs={24}>
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
            {/* <Col xs={24} sm={12}>
              <Form.Item
                label="Job Title / Designation"
                name="jobTitle"
                // rules={[{ required: true, message: "Please enter job title" }]}
              >
                <Input placeholder="Enter job title" />
              </Form.Item>
            </Col> */}
            <Col xs={24} sm={12}>
              <Form.Item
                label="Salary"
                name="salary"
              // rules={[{ required: true, message: "Please enter salary" }]}
              >
                <Input placeholder="Enter salary" type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Work Location"
                name="workLocation"
              >
                <Input placeholder="Enter work location" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>

            <Col xs={24} sm={12}>
              <Form.Item
                label="Reporting Manager"
                name="reportingManager"
              >
                <Input placeholder="Enter reporting manager name" />
              </Form.Item>
            </Col>
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
          <Divider orientation="left">
            Passport Details
          </Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Passport Number"
                name="passportNumber"
              >
                <Input placeholder="Enter passport number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Passport Expiry Date"
                name="passportExpiryDate"
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
              <Divider orientation="left">Visa Details</Divider>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Visa ID Number"
                    name="visaIdNumber"
                  // rules={[{ required: true, message: "Please enter Visa ID number" }]}
                  >
                    <Input placeholder="Enter Visa ID number" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Visa Issue Date"
                    name="visaIssueDate"
                  // rules={[{ required: true, message: "Please select issue date" }]}
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
                  // rules={[{ required: true, message: "Please select expiry date" }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>

                {/* <Col xs={24} sm={12}>
                  <Form.Item
                    label="Visa Type"
                    name="visaType"
                  // rules={[{ required: true, message: "Please enter visa type" }]}
                  >
                    <Select placeholder="Select visa type">
                      <Option value="Tourist Visa">Tourist Visa</Option>
                      <Option value="Residence Visa">Residence Visa</Option>
                    </Select>
                  </Form.Item>
                </Col> */}

              
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Country of Visa Issuance"
                    name="countryOfVisaIssuance"
                    normalize={(value) => (Array.isArray(value) ? value[0] : value)}
                  // rules={[{ required: true, message: "Please enter Country of Visa Issuance" }]}
                  >
                    <Select
                      mode="tags"
                      maxCount={1}
                      placeholder="Select or type Country of Visa Issuance"
                      style={{ width: "100%" }}
                      tokenSeparators={[","]}
                      options={visaCountryOptions.map((country) => ({
                        value: country,
                        label: country,
                      }))}
                    >
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



          {existingDocuments.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Typography.Text strong style={{ color: '#fff' }}>Existing Documents:</Typography.Text>
              <div
                style={{
                  marginTop: 8,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {existingDocuments.map((doc, index) => (
                  <Card
                    key={`${doc.url || doc.name || "doc"}-${index}`}
                    size="small"
                    style={{ borderRadius: 8 }}
                    styles={{ body: { padding: 10 } }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }} size={4}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        {editingDocumentIndex === index ? (
                          <Space.Compact style={{ width: "100%" }}>
                            <Input
                              size="small"
                              value={editingDocumentName}
                              onChange={(event) => setEditingDocumentName(event.target.value)}
                              onPressEnter={() => saveRenameDocument(index)}
                              disabled={documentsUpdating}
                            />
                            <Tooltip title="Save">
                              <Button
                                type="text"
                                size="small"
                                icon={<CheckOutlined />}
                                onClick={() => saveRenameDocument(index)}
                                loading={documentsUpdating}
                              />
                            </Tooltip>
                            <Tooltip title="Cancel">
                              <Button
                                type="text"
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={cancelRenameDocument}
                                disabled={documentsUpdating}
                              />
                            </Tooltip>
                          </Space.Compact>
                        ) : (
                          <Typography.Text ellipsis={{ tooltip: doc.name }} style={{ fontWeight: 500, flex: 1 }}>
                            {doc.name}
                          </Typography.Text>
                        )}

                        {editingDocumentIndex !== index && (
                          <Space size={0}>
                            <Tooltip title="Rename">
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => startRenameDocument(index, doc.name)}
                                disabled={documentsUpdating}
                              />
                            </Tooltip>
                            <Popconfirm
                              title="Delete this document?"
                              okText="Delete"
                              cancelText="Cancel"
                              onConfirm={() => deleteDocument(index)}
                              disabled={documentsUpdating}
                            >
                              <Tooltip title="Delete">
                                <Button
                                  type="text"
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                  disabled={documentsUpdating}
                                />
                              </Tooltip>
                            </Popconfirm>
                          </Space>
                        )}
                      </div>

                      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        {doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : "N/A"} - {formatDate(doc.uploadDate)}
                      </Typography.Text>
                    </Space>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Form.Item
          // label="Upload Documents"
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
              multiple
              maxCount={10}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>
                Upload Documents
              </Button>
            </Upload>
            <Text type="secondary" style={{ fontSize: "12px", display: "block", marginTop: 4 , color:'#fff'}}>
              Upload passport, visa, Emirates ID, and other relevant documents (all file formats supported)
            </Text>
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
          <Divider orientation="left">
            Emergency Contact Details
          </Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Guardian's Name"
                name="guardianName"
              >
                <Input placeholder="Enter guardian's name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Guardian's Mobile Number"
                required={false}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Form.Item name="guardianCountryCode" noStyle rules={[COUNTRY_CODE_VALIDATION_RULE]}>
                    <Input placeholder="Country" prefix="+" maxLength={4} style={{ width: "28%" }} />
                  </Form.Item>
                  <Form.Item name="guardianMobileNumber" noStyle rules={[PHONE_VALIDATION_RULE]}>
                    <Input placeholder="Contact number" style={{ width: "72%" }} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Alternate Mobile Number"
                required={false}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Form.Item name="alternateGuardianCountryCode" noStyle rules={[COUNTRY_CODE_VALIDATION_RULE]}>
                    <Input placeholder="Country" prefix="+" maxLength={4} style={{ width: "28%" }} />
                  </Form.Item>
                  <Form.Item name="alternateGuardianMobileNumber" noStyle rules={[PHONE_VALIDATION_RULE]}>
                    <Input placeholder="Contact number" style={{ width: "72%" }} />
                  </Form.Item>
                </Space.Compact>
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
          <Divider orientation="left">
            Bank Account Information
          </Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Bank Name"
                name="bankName"
              // rules={[{ required: true, message: "Please enter bank name" }]}
              >
                <Input placeholder="Enter bank name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Account Holder Name"
                name="accountHolderName"
              // rules={[{ required: true, message: "Please enter account holder name" }]}
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
              // rules={[{ required: true, message: "Please enter account number" }]}
              >
                <Input placeholder="Enter account number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="IBAN Number"
                name="ibanNumber"
              >
                <Input placeholder="Enter IBAN number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="IFSC Code"
                name="ifscCode"
              // rules={[{ required: true, message: "Please enter IFSC code" }]}
              >
                <Input placeholder="Enter IFSC code" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Swift Code"
                name="swiftCode"
              >
                <Input placeholder="Enter Swift code" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Account Type"
                name="accountType"
              // rules={[{ required: true, message: "Please select account type" }]}
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
    }
  ];

  return (<>
  
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        setEmployeeStatus("Tourist");
        setActiveTab("1");
        setFileList([]);
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
          // background: "rgb(245, 245, 245)"
        },
      }}
    >
      {/* <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#1a1a2e", fontWeight: 600 }}>
          Edit Employee
        </Title>
        <Text type="secondary">Update employee details across different sections</Text>
      </div> */}

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={() => setSubmitFromUpdateButton(false)}
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
                  htmlType="button"
                  size="large"
                  onClick={goToPreviousTab}
                >
                  Previous
                </Button>
              )}
              <Button
                htmlType="button"
                size="large"
                onClick={() => {
                  setSubmitFromUpdateButton(false);
                  form.resetFields();
                  setEmployeeStatus("Tourist");
                  setActiveTab("1");
                  setFileList([]);
                  onCancel();
                }}
              >
                Cancel
              </Button>
              {activeTab !== "4" ? (
                <Button
                  type="primary"
                  htmlType="button"
                  size="large"
                  onClick={goToNextTab}
                  style={{
                    background: "#52c41a",
                    borderColor: "#52c41a"
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="button"
                  size="large"
                  loading={loading}
                  onClick={() => {
                    setSubmitFromUpdateButton(true);
                    form.submit();
                  }}
                  style={{
                    background: "#52c41a",
                    borderColor: "#52c41a"
                  }}
                >
                  Update Employee
                </Button>
              )}
            </Space>
          </div>
        </Form.Item>
      </Form>
    </Modal>
    <style>
    {`
    .ant-upload-wrapper .ant-upload-list .ant-upload-list-item .ant-upload-list-item-actions .anticon {
      color: #fff !important;
    }
    `}
  </style>
  ,</>
  );
  
};

export default EditEmployeeModal;