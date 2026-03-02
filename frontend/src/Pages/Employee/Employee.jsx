import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Space,
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
  SearchOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import AddEmployeeModal from "./addEmployee";
import EditEmployeeModal from "./EditEmployee";
import ViewEmployee from "./viewEmployee";
import { employeeAPI, authAPI } from "../../services/api";
import { formatDate } from "../../services/dateUtils";
import { formatPhoneNumber, splitPhoneNumber } from "../../services/phoneUtils";

const { Title, Text } = Typography;
const DEFAULT_COMPANY_OPTIONS = ["Royal Falcon", "Royal Tree", "Royal Grid", "Royal Net", "SoftEx"];

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
  const [paginationCurrent, setPaginationCurrent] = useState(1);
  const [paginationPageSize, setPaginationPageSize] = useState(20);
  const [selectedCompanyFilters, setSelectedCompanyFilters] = useState([]);

  // Available columns configuration
  const [availableColumns] = useState([
    { key: 'employee', label: 'Employee' },
    { key: 'employeeCode', label: 'Emp ID' },
    { key: 'contact', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'role', label: 'Role' },
    { key: 'company', label: 'Company' },
    { key: 'workLocation', label: 'Work Location' },
    { key: 'nationality', label: 'Nationality ' },
    { key: 'passportNumber', label: 'Passport No.' },
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
    { key: 'customize', label: 'Customize' },
    { key: 'actions', label: 'Actions' },
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
    'passportNumber',
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

  const sortEmployeesByCodeDesc = (employeeList) => {
    return [...employeeList].sort((firstEmployee, secondEmployee) => {
      const firstCode = (firstEmployee.employeeCode || "").toString().trim();
      const secondCode = (secondEmployee.employeeCode || "").toString().trim();

      const firstNumericPart = parseInt(firstCode.replace(/\D/g, ""), 10);
      const secondNumericPart = parseInt(secondCode.replace(/\D/g, ""), 10);

      const firstHasNumber = !Number.isNaN(firstNumericPart);
      const secondHasNumber = !Number.isNaN(secondNumericPart);

      if (firstHasNumber && secondHasNumber) {
        return secondNumericPart - firstNumericPart;
      }

      return secondCode.localeCompare(firstCode);
    });
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      if (response.data.success) {
        const sortedEmployees = sortEmployeesByCodeDesc(response.data.data || []);
        setEmployees(sortedEmployees);
        setFilteredEmployees(sortedEmployees);
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
      setFilteredEmployees(sortEmployeesByCodeDesc(employees));
      setPaginationCurrent(1);
      return;
    }

    const filtered = employees.filter((emp) => {
      const search = searchText.toLowerCase();
      return (
        emp.name?.toLowerCase().startsWith(search) ||
        emp.id?.toLowerCase().startsWith(search) ||
        emp.email?.toLowerCase().startsWith(search) ||
        emp.department?.toLowerCase().startsWith(search) ||
        emp.role?.toLowerCase().startsWith(search) ||
        emp.mobileNo?.startsWith(search) ||
        emp.employeeCode?.toLowerCase().startsWith(search)
      );
    });

    setFilteredEmployees(sortEmployeesByCodeDesc(filtered));
    setPaginationCurrent(1);
  };

  const handleTableChange = (pagination, filters) => {
    setPaginationCurrent(pagination.current || 1);
    setPaginationPageSize(pagination.pageSize || 20);

    const companyValues = Array.isArray(filters?.company)
      ? filters.company.map((value) => value?.toString()).filter(Boolean)
      : [];

    setSelectedCompanyFilters(companyValues);
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

  const companyFilterMap = DEFAULT_COMPANY_OPTIONS.reduce((companyMap, companyName) => {
    const cleanCompanyName = (companyName || "").toString().trim();
    if (cleanCompanyName) {
      companyMap.set(cleanCompanyName.toLowerCase(), cleanCompanyName);
    }
    return companyMap;
  }, new Map());

  employees.forEach((employee) => {
    const rawCompany = (employee.company || "").toString().trim();
    const companyLabel = rawCompany || "N/A";
    const companyKey = companyLabel.toLowerCase();

    if (!companyFilterMap.has(companyKey)) {
      companyFilterMap.set(companyKey, companyLabel);
    }
  });

  const companyFilters = Array.from(companyFilterMap.values())
    .sort((firstCompany, secondCompany) => {
      const isFirstNA = firstCompany.toLowerCase() === "n/a";
      const isSecondNA = secondCompany.toLowerCase() === "n/a";

      if (isFirstNA && !isSecondNA) {
        return 1;
      }

      if (!isFirstNA && isSecondNA) {
        return -1;
      }

      return firstCompany.localeCompare(secondCompany, undefined, { sensitivity: "base" });
    })
    .map((company) => ({
      text: company,
      value: company,
    }));

  const allColumnsDefinition = [
    {
      title: "Sr. No.",
      key: "srNo",
      render: (_, __, index) => ((paginationCurrent - 1) * paginationPageSize + index + 1) + "."
    },
    {
      title: "Employee Name",
      key: "employee",
      render: (_, record) => (
        <Space>
          <div>
            <div >{record.name}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Emp ID",
      dataIndex: "employeeCode",
      key: "employeeCode",
      render: (code) => code || "N/A",
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => {
        const formattedPhone = formatPhoneNumber(record.mobileNo);

        if (formattedPhone === "N/A") {
          return <div style={{ marginBottom: 4 }}>{formattedPhone}</div>;
        }

        const { countryCode, number } = splitPhoneNumber(formattedPhone);

        return (
          <div >
           <span > {countryCode}</span>
            {number ? `  ${number}` : ""}
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "N/A",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
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
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      filters: companyFilters,
      filteredValue: selectedCompanyFilters,
      filterSearch: true,
      filterMultiple: true,
      onFilter: (value, record) => {
        const companyLabel = (record.company || "").toString().trim() || "N/A";
        return companyLabel.toLowerCase() === value.toString().toLowerCase();
      },
      render: (company) => (
        <div color="purple" style={{ borderRadius: 4 }}>
          {company || "N/A"}
        </div>
      ),
    },
    {
      title: "Work Location",
      dataIndex: "workLocation",
      key: "workLocation",
      render: (workLocation) => workLocation || "N/A",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
      render: (nationality) => nationality || "N/A",
    },
    {
      title: "Passport No.",
      dataIndex: "passportNumber",
      key: "passportNumber",
      render: (passportNo) => passportNo || "N/A"
    },
    {
      title: "Passport Expiry",
      dataIndex: "passportExpiryDate",
      key: "passportExpiryDate",
      render: (passportExpiryDate) => formatDate(passportExpiryDate)
    },
    {
      title: " Visa Expiry",
      dataIndex: "visaExpiryDate",
      key: "visaExpiryDate",
      render: (visaExpiryDate) => formatDate(visaExpiryDate)
    },
    {
      title: "Joining Date",
      dataIndex: "dateOfJoining",
      key: "joiningDate",
      render: (date) => formatDate(date),
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (salary) => salary ? `$${salary.toLocaleString()}` : "N/A",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => gender || "N/A",
    },
    {
      title: "Job Title",
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (jobTitle) => jobTitle || "N/A",
    },

    {
      title: "Reporting Manager",
      dataIndex: "reportingManager",
      key: "reportingManager",
      render: (reportingManager) => reportingManager || "N/A",
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      render: (bloodGroup) => bloodGroup || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      // fixed: "right",  
      width: 120,
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
  const employeesToDisplay = selectedCompanyFilters.length
    ? filteredEmployees.filter((employee) => {
      const companyLabel = (employee.company || "").toString().trim() || "N/A";
      return selectedCompanyFilters.some(
        (selectedCompany) => selectedCompany.toLowerCase() === companyLabel.toLowerCase()
      );
    })
    : filteredEmployees;

  return (
    <div
      className="employee-page"
      style={{ padding: "10px", minHeight: "100vh", background: "#f6f2f2", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <Card style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <Title level={2} style={{ margin: 0, color: "#1a1a2e", fontSize: 20 }}>
              Employees<span className="text-green-600"> ({employeesToDisplay.length})</span>
            </Title>
          </div>
          <Space.Compact size="large" style={{ maxWidth: 450, width: "100%" }}>
            <Input
              placeholder="Search by Name, Emp Id, Department, Company"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            <Button
              htmlType="button"
              icon={<SearchOutlined />}
              style={{
                background: "#40b606",
                borderColor: "#40b606",
                color: "#fff"
              }}
            />
          </Space.Compact>
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
        </div>
      </Card>

      <Card>
        <Spin spinning={loading}>
          <Table
            dataSource={employeesToDisplay}
            columns={columns}
            rowKey={(record) => record._id || record.id}
            onChange={handleTableChange}
            pagination={{
              current: paginationCurrent,
              pageSize: paginationPageSize,
              defaultPageSize: 20,
              pageSizeOptions: ["20", "50", "100"],
              showSizeChanger: true,
              showLessItems: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            tableLayout="auto"
            scroll={{ x: "max-content" }}
            bordered
          />
        </Spin>
      </Card>

      <AddEmployeeModal
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSuccess={() => {
          setIsAddModalVisible(false);
          loadEmployees();
        }}
      />

      <EditEmployeeModal
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedEmployee(null);
        }}
        onSuccess={loadEmployees}
        employee={selectedEmployee}
      />

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
          </div>
        }
      >
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
                style={{ width: '100%' }}
              >
                <Space>
                  <span style={{ fontWeight: 500 }}>{col.label}</span>
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
      .employee-page .ant-card .ant-card-body {
        padding: 5px 10px;
      }

      .employee-page .ant-table-wrapper .ant-table-filter-trigger {
        color: #fff;
      }

      .employee-page .ant-table-wrapper .ant-table-filter-trigger:hover {
        color: #fff;
      }
        `}
      </style>
    </div>

  );
};

export default Employee;