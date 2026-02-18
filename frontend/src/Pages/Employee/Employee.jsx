import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  message,
  Card,
  Typography,
  Avatar,
  Drawer,
  Spin,
  Checkbox,
  Divider,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import AddEmployeeModal from "./addEmployee";
import EditEmployeeModal from "./EditEmployee";
import ViewEmployee from "./viewEmployee";
import { employeeAPI, authAPI } from "../../services/api";
import pageBackground from "../../assets/bg.jpg";

const { Search } = Input;
const { Title, Text } = Typography;

const Employee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [customizeDrawerVisible, setCustomizeDrawerVisible] = useState(false);
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [viewEmployeeId, setViewEmployeeId] = useState(null);

  // Available columns configuration
  const [availableColumns] = useState([
    { key: 'employee', label: 'Employee', fixed: true },
    { key: 'employeeCode', label: 'Emp ID', fixed: true },
    { key: 'contact', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'role', label: 'Role' },
    { key: 'company', label: 'Company' },
    { key: 'workLocation', label: 'Work Location' },
    { key: 'nationality', label: 'Nationality ' },  
    { key: 'passportNo', label: 'Passport No.' },
    { key: 'passportExpiryDate', label: 'Passport Expiry Date' },
    { key: 'visaExpiryDate', label: 'Visa Expiry Date' },
    { key: 'joiningDate', label: 'Joining Date' },
    { key: 'salary', label: 'Salary' },
    { key: 'gender', label: 'Gender' },
    { key: 'nationality', label: 'Nationality' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'workLocation', label: 'Work Location' },
    { key: 'reportingManager', label: 'Reporting Manager' },
    { key: 'bloodGroup', label: 'Blood Group' },
    { key: 'customize', label: 'Customize', fixed: true },
    { key: 'actions', label: 'Actions', fixed: true },
  ]);

  // Visible columns state - default visible columns
  const [visibleColumns, setVisibleColumns] = useState([
    'srNo',
    'employee',
    'employeeCode',
    'contact',
    'email',
    'department',
    'role',
    'company',
    'workLocation',
    'nationality',
    'passportNo',
    'passportExpiryDate',
    'visaExpiryDate',
    'customize',
    'actions'
  ]);

  useEffect(() => {
    loadEmployees();
    loadCurrentUserRole();
  }, []);

  useEffect(() => {
    if (location.state?.refreshEmployeesAt) {
      loadEmployees();
    }
  }, [location.state?.refreshEmployeesAt]);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchText]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      if (response.data.success) {
        setEmployees(response.data.data);
        setFilteredEmployees(response.data.data);
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUserRole = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data.success) {
        setCurrentRole((response.data.data.role || "").toLowerCase());
      }
    } catch (error) {
      setCurrentRole("");
    }
  };

  const filterEmployees = () => {
    if (!searchText) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter((emp) => {
      const search = searchText.toLowerCase();
      return (
        emp.name?.toLowerCase().includes(search) ||
        emp.id?.toLowerCase().includes(search) ||
        emp.email?.toLowerCase().includes(search) ||
        emp.department?.toLowerCase().includes(search) ||
        emp.role?.toLowerCase().includes(search) ||
        emp.mobileNo?.includes(search) ||
        emp.employeeCode?.toLowerCase().includes(search)
      );
    });

    setFilteredEmployees(filtered);
  };

  const handleDelete = async (id) => {
    try {
      const response = await employeeAPI.delete(id);
      if (response.data.success) {
        message.success("Employee deleted successfully");
        loadEmployees(); // Reload the list
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete employee");
    }
  };

  const handleEdit = (record) => {
    setSelectedEmployee(record);
    setIsEditModalVisible(true);
  };



  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnKey)) {
        return prev.filter(key => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  const allColumnsDefinition = [
    {
      title:"Sr. No.",
      key:"srNo",
      fixed: "left",
      width:70,
      render: (_, __, index) => index + 1 +"." // Display 1-based index
    },
    {
      title: "Employee Name",
      key: "employee",
      fixed: "left",
      width: 200,
      render: (_, record) => (
        <Space>
          <div>
            <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {/* {record.employeeCode || record.id} */}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Emp ID",
      dataIndex: "employeeCode",
      key: "employeeCode",
      width: 80,
      render: (code) => code || "N/A",  
    },
    {
      title: "Contact",
      key: "contact",
      width: 190,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            {/* <PhoneOutlined style={{ marginRight: 8, color: "#1890ff" }} /> */}
            {record.mobileNo || "N/A"}
          </div>
          {/* <div>
            <MailOutlined style={{ marginRight: 8, color: "#52c41a" }} />
            <Text ellipsis style={{ maxWidth: 150 }}>
              {record.email || record.officeEmail || "N/A"}
            </Text>
          </div> */}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (email) => email || "N/A",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      width: 120,
      render: (dept) => (
        <div color="blue" style={{ borderRadius: 4 }}>
          {dept}
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      width: 150,
      render: (company) => (
        <div color="purple" style={{ borderRadius: 4 }}>
          {company}
        </div>
      ),
    },
    {
      title: "Work Location",
      dataIndex: "workLocation",
      key: "workLocation",
      width: 150,
      render: (workLocation) => workLocation || "N/A",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key : "nationality",
      width: 130,
      render: (nationality) =>  nationality || "N/A", 
    },
    {
      title:"Passport No.",
      dataIndex:"passportNo",
      key:"passportNo",
      width:130,
      render:(passportNo) => passportNo || "N/A"
    },
    {
      title:"Passport Expiry Date",
      dataIndex:"passportExpiryDate",
      key:"passportExpiryDate",
      width:180,
      render:(passportExpiryDate) => passportExpiryDate || "N/A"
    },
    {
      title:" Visa Expiry Date",
      dataIndex:"visaExpiryDate",
      key:"visaExpiryDate",
      width:130,
      render:(visaExpiryDate) => visaExpiryDate || "N/A"  
    },
    {
      title: "Joining Date",
      dataIndex: "dateOfJoining",
      key: "joiningDate",
      width: 130,
      render: (date) => date || "N/A",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      width: 130,
      render: (salary) => salary ? `$${salary.toLocaleString()}` : "N/A",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender) => gender || "N/A",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
      width: 130,
      render: (nationality) => nationality || "N/A",
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
      width: 150,
      render: (jobTitle) => jobTitle || "N/A",
    },
    
    {
      title: "Reporting Manager",
      dataIndex: "reportingManager",
      key: "reportingManager",
      width: 150,
      render: (reportingManager) => reportingManager || "N/A",
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      width: 110,
      render: (bloodGroup) => bloodGroup || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      // fixed: "right",  
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="button"
            icon={<EyeOutlined />}
            onClick={() => {
              setViewEmployeeId(record._id || record.id);
              setViewDrawerVisible(true);
            }}
            style={{ color: "blue", borderColor: "blue" }}
          >
           
          </Button>
          <Button
            type=""
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: "green", borderColor: "green" }}
          >
           
          </Button>
          {currentRole === "admin" && (
            <Popconfirm
              title="Are you sure you want to delete this employee?"
              onConfirm={() => handleDelete(record._id || record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="" danger icon={<DeleteOutlined />}>
      
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
    
  ];

  // Filter columns based on visibility
  const columns = allColumnsDefinition.filter(col => visibleColumns.includes(col.key));

  return (
    <div style={{ padding: "10px", minHeight: "100vh", backgroundImage: `url(${pageBackground})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Search and Add Button */}
      <Card style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Title level={2} style={{ margin: 0, color: "#1a1a2e", fontSize: 20 }}>
              Employees<span className="text-green-600"> ({filteredEmployees.length})</span>
            </Title>
            {/* <Text type="secondary">Manage and track all employee information</Text> */}
          </div>
          <Search
            placeholder="Search by Name, Emp Id, Department, Company"
            allowClear
            enterButton={
              <Button
                icon={<SearchOutlined />}
                style={{
                  background: "#40b606",
                  borderColor: "#40b606",
                  color: "#fff"
                }}
              />
            }
            
            size="large"
            style={{ maxWidth: 450 , hover:{background:"#40b606", borderColor:"#40b606", color:"#fff"}}}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            
          />
          <Button
            type="primary"
            size="large"
            icon={<SettingOutlined />}
            onClick={() => setCustomizeDrawerVisible(true)}
            style={{
              background: "#40b606",
              borderColor: "#40b606"
            }}
          >
            Customize
          </Button>
          {/* {
      title: "Customize",
      key: "customize",
      // fixed: "right",
      width: 130,
      render: () => (
        <Button
          type="primary"
          icon={<SettingOutlined />}
          onClick={() => setCustomizeDrawerVisible(true)}
        // style={{
        //   background: "#031c4e",
        //   borderColor: "#031c4e"
        // }}
        >
          Customize
        </Button>
      ),
    }, */}
          {/* <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
            style={{
              background: "#031c4e",
              borderColor: "#031c4e"
            }}
          >
            Add Employee
          </Button> */}
        </div>
      </Card>

      {/* Employee Table */}
      <Card>
        <Spin spinning={loading}>
          <Table
            dataSource={filteredEmployees}
            columns={columns}
            rowKey={(record) => record._id || record.id}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              
            }}
            scroll={{ x: 1200 }}
            bordered
          />
        </Spin>
      </Card>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSuccess={() => {
          setIsAddModalVisible(false);
          loadEmployees();
        }}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedEmployee(null);
        }}
        onSuccess={loadEmployees}
        employee={selectedEmployee}
      />

      {/* Customize Columns Drawer */}
      <Drawer
        title={
          <Space>
            <SettingOutlined style={{ fontSize: 20, color: "#031c4e" }} />
            <span>Customize Table Columns</span>
          </Space>
        }
        placement="right"
        width={400}
        onClose={() => setCustomizeDrawerVisible(false)}
        open={customizeDrawerVisible}
        footer={
          <div style={{ textAlign: 'right' }}>
            {/* <Space>
              <Button onClick={() => setCustomizeDrawerVisible(false)}>
                Close
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  message.success('Column settings applied');
                  setCustomizeDrawerVisible(false);
                }}
                style={{
                  background: "#031c4e",
                  borderColor: "#031c4e"
                }}
              >
                Apply
              </Button>
            </Space> */}
          </div>
        }
      >
        {/* <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Select the columns you want to display in the employee table. Fixed columns cannot be hidden.
          </Text>
        </div> */}

        {/* <Divider orientation="left">Available Columns</Divider> */}

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {availableColumns.map((col) => (
            <Card
              key={col.key}
              size="small"
              style={{
                background: visibleColumns.includes(col.key) ? '#f0f5ff' : '#fff',
                borderColor: visibleColumns.includes(col.key) ? '#1890ff' : '#d9d9d9',
              }}
            >
              <Checkbox
                checked={visibleColumns.includes(col.key)}
                onChange={() => handleColumnToggle(col.key)}
                disabled={col.fixed}
                style={{ width: '100%' }}
              >
                <Space>
                  <span style={{ fontWeight: 500 }}>{col.label}</span>
                  {col.fixed && (
                    <Tag color="blue" style={{ fontSize: 10 }}>
                      Fixed
                    </Tag>
                  )}
                </Space>
              </Checkbox>
            </Card>
          ))}
        </Space>

        <Divider />

        <div style={{
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: 8,
          marginTop: 16
        }}>
          <Text strong>Visible Columns: </Text>
          <Text type="secondary">
            {visibleColumns.length} / {availableColumns.length}
          </Text>
        </div>
      </Drawer>

      {/* View Employee Drawer */}
      {viewDrawerVisible && viewEmployeeId && (
        <ViewEmployee
          id={viewEmployeeId}
          open={viewDrawerVisible}
          onClose={() => {
            setViewDrawerVisible(false);
            setViewEmployeeId(null);
          }}
        />
      )}
      <style>
        {`
      .ant-card .ant-card-body {
    padding: 5px 10px;
}
      `}
      </style>
    </div>

  );
};

export default Employee;