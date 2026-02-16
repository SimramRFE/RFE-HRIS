import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Input,
  Button,
  Space,
  Tabs,
  Progress,
  Tooltip,
  Modal,
  Form,
  TimePicker,
  message,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
// TabPane is now deprecated, using items prop instead

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [attendanceStats, setAttendanceStats] = useState({
    totalPresent: 0,
    totalAbsent: 0,
    totalOnLeave: 0,
    totalOffDay: 0,
    averageAttendance: 0,
  });

  useEffect(() => {
    loadEmployees();
    generateAttendanceData();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [attendanceRecords, selectedEmployee, selectedDateRange, searchText]);

  const loadEmployees = () => {
    const storedEmployees = localStorage.getItem("employees");
    const employeeData = storedEmployees ? JSON.parse(storedEmployees) : [];
    setEmployees(employeeData);
  };

  const generateAttendanceData = () => {
    // Generate attendance data from start of current month to current date
    const storedEmployees = localStorage.getItem("employees");
    const employeeData = storedEmployees ? JSON.parse(storedEmployees) : [];
    const storedLeaves = localStorage.getItem("leaves");
    const leaveData = storedLeaves ? JSON.parse(storedLeaves) : [];
    
    const records = [];
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    const daysInPeriod = today.diff(startOfMonth, 'day') + 1; // Include today
    
    employeeData.forEach((employee) => {
      for (let i = 0; i < daysInPeriod; i++) {
        const date = startOfMonth.add(i, 'day');
        const dateString = date.format('YYYY-MM-DD');
        
        // Check day of week (Saturday = 6, Sunday = 0)
        const dayOfWeek = date.day();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Check if employee has approved leave on this date
        const hasLeave = leaveData.some(leave => 
          leave.employeeId === employee.id &&
          leave.status === 'approved' &&
          dayjs(dateString).isBetween(dayjs(leave.startDate), dayjs(leave.endDate), null, '[]')
        );
        
        let status;
        let checkIn = null;
        let checkOut = null;
        
        if (isWeekend) {
          // Mark weekends as Off Day
          status = 'Off Day';
        } else if (hasLeave) {
          status = 'On Leave';
        } else {
          // Random attendance with 90% presence probability for weekdays
          const isPresent = Math.random() < 0.90;
          if (isPresent) {
            status = 'Present';
            // Random check-in between 8:30-9:30 AM
            checkIn = dayjs().hour(8).minute(30 + Math.floor(Math.random() * 60)).format('HH:mm');
            // Random check-out between 5:00-6:30 PM
            checkOut = dayjs().hour(17).minute(Math.floor(Math.random() * 90)).format('HH:mm');
          } else {
            // Only mark as absent if not on leave and it's a weekday
            status = 'Absent';
          }
        }
        
        records.push({
          id: `${employee.id}-${dateString}`,
          employeeId: employee.id,
          employeeName: employee.name,
          department: employee.department,
          date: dateString,
          status,
          checkIn,
          checkOut,
          workingHours: checkIn && checkOut ? calculateWorkingHours(checkIn, checkOut) : null,
        });
      }
    });
    
    setAttendanceRecords(records);
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    const start = dayjs(`2000-01-01 ${checkIn}`);
    const end = dayjs(`2000-01-01 ${checkOut}`);
    return end.diff(start, 'hour', true).toFixed(1);
  };

  const filterRecords = () => {
    let filtered = [...attendanceRecords];
    
    // Filter by employee
    if (selectedEmployee) {
      filtered = filtered.filter(record => record.employeeId === selectedEmployee);
    }
    
    // Filter by date range
    if (selectedDateRange && selectedDateRange.length === 2) {
      const [start, end] = selectedDateRange;
      filtered = filtered.filter(record => {
        const recordDate = dayjs(record.date);
        return recordDate.isBetween(start, end, null, '[]');
      });
    }
    
    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(record =>
        record.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
        record.department.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredRecords(filtered);
    calculateStats(filtered);
  };

  const calculateStats = (records) => {
    const totalPresent = records.filter(r => r.status === 'Present').length;
    const totalOnLeave = records.filter(r => r.status === 'On Leave').length;
    const totalOffDay = records.filter(r => r.status === 'Off Day').length;
    // Calculate attendance percentage based on working days only (exclude Off Day)
    const workingDaysRecords = records.filter(r => r.status !== 'Off Day');
    const totalWorkingDays = workingDaysRecords.length;
    const averageAttendance = totalWorkingDays > 0 ? ((totalPresent / totalWorkingDays) * 100).toFixed(1) : 0;
    
    setAttendanceStats({
      totalPresent,
      totalAbsent: 0,
      totalOnLeave,
      totalOffDay,
      averageAttendance: parseFloat(averageAttendance),
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'green';
      case 'Absent': return 'red';
      case 'On Leave': return 'blue';
      case 'Off Day': return 'gray';
      default: return 'default';
    }
  };

  const handleAddAttendance = (values) => {
    const { employeeId, date, status, checkIn, checkOut } = values;
    const employee = employees.find(emp => emp.id === employeeId);
    
    const newRecord = {
      id: `${employeeId}-${date.format('YYYY-MM-DD')}`,
      employeeId,
      employeeName: employee.name,
      department: employee.department,
      date: date.format('YYYY-MM-DD'),
      status,
      checkIn: checkIn ? checkIn.format('HH:mm') : null,
      checkOut: checkOut ? checkOut.format('HH:mm') : null,
      workingHours: checkIn && checkOut ? calculateWorkingHours(checkIn.format('HH:mm'), checkOut.format('HH:mm')) : null,
    };
    
    // Remove existing record for same employee and date
    const updatedRecords = attendanceRecords.filter(r => r.id !== newRecord.id);
    updatedRecords.push(newRecord);
    
    setAttendanceRecords(updatedRecords);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Attendance record added successfully!');
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD-MM-YYYY'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.employeeName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.employeeId} | {record.department}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={status === 'Present' ? <UserOutlined /> : <ClockCircleOutlined />}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Present', value: 'Present' },
        { text: 'Absent', value: 'Absent' },
        { text: 'On Leave', value: 'On Leave' },
        { text: 'Off Day (Weekend)', value: 'Off Day' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (checkIn) => checkIn || '-',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (checkOut) => checkOut || '-',
    },
    {
      title: 'Working Hours',
      dataIndex: 'workingHours',
      key: 'workingHours',
      render: (hours) => hours ? `${hours}h` : '-',
    },
  ];

  const getEmployeeAttendanceStats = () => {
    const employeeStats = employees.map(employee => {
      const employeeRecords = filteredRecords.filter(r => r.employeeId === employee.id);
      const presentCount = employeeRecords.filter(r => r.status === 'Present').length;
      const totalRecords = employeeRecords.length;
      const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;
      
      return {
        ...employee,
        attendancePercentage: attendancePercentage.toFixed(1),
        presentDays: presentCount,
        totalDays: totalRecords,
      };
    });
    
    return employeeStats.sort((a, b) => b.attendancePercentage - a.attendancePercentage);
  };

  const employeeStatsColumns = [
    {
      title: 'Employee',
      key: 'employee',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.id} | {record.department}
          </div>
        </div>
      ),
    },
    {
      title: 'Attendance Rate',
      key: 'attendance',
      render: (_, record) => (
        <div>
          <Progress 
            percent={parseFloat(record.attendancePercentage)} 
            size="small"
            strokeColor={
              record.attendancePercentage >= 90 ? '#52c41a' : 
              record.attendancePercentage >= 80 ? '#faad14' : '#ff4d4f'
            }
          />
          <span>{record.attendancePercentage}%</span>
        </div>
      ),
      sorter: (a, b) => a.attendancePercentage - b.attendancePercentage,
    },
    {
      title: 'Present Days',
      dataIndex: 'presentDays',
      key: 'presentDays',
      render: (days, record) => `${days}/${record.totalDays}`,
    },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: "#1a1a2e" }}>Attendance Management</h2>
          <p style={{ color: "#666", margin: "4px 0 0 0" }}>
            Track and manage employee attendance records
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          style={{ borderRadius: '8px' }}
        >
          Add Attendance
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Present Days"
              value={attendanceStats.totalPresent}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        {/* <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Absent Days"
              value={attendanceStats.totalAbsent}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col> */}
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="On Leave"
              value={attendanceStats.totalOnLeave}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Off Days (Weekends)"
              value={attendanceStats.totalOffDay}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#8c8c8c" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Attendance"
              value={attendanceStats.averageAttendance}
              suffix="% (Working Days)"
              prefix={<UserOutlined />}
              valueStyle={{ 
                color: attendanceStats.averageAttendance >= 90 ? "#52c41a" : 
                       attendanceStats.averageAttendance >= 80 ? "#faad14" : "#ff4d4f" 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Row for Average Attendance */}
      {/* <Row gutter={16} style={{ marginBottom: 24 }}>
        
      </Row> */}

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="Select Employee"
              style={{ width: '100%' }}
              allowClear
              onChange={setSelectedEmployee}
              showSearch
              optionFilterProp="children"
            >
              {employees.map(emp => (
                <Option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.id})
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={setSelectedDateRange}
              format="DD-MM-YYYY"
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="Search by name, ID, or department"
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Space>
              <Button onClick={() => {
                setSelectedEmployee(null);
                setSelectedDateRange(null);
                setSearchText("");
              }}>
                Clear Filters
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tabs */}
      <Card variant="outlined" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Tabs 
          defaultActiveKey="records" 
          size="large"
          items={[
            {
              key: 'records',
              label: (
                <span>
                  <CalendarOutlined />
                  Attendance Records ({filteredRecords.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={filteredRecords}
                  columns={columns}
                  rowKey="id"
                  pagination={{ 
                    pageSize: 15,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                  scroll={{ x: 800 }}
                />
              )
            },
            {
              key: 'stats',
              label: (
                <span>
                  <UserOutlined />
                  Employee Statistics ({employees.length})
                </span>
              ),
              children: (
                <Table
                  dataSource={getEmployeeAttendanceStats()}
                  columns={employeeStatsColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              )
            }
          ]}
        />
      </Card>

      {/* Add Attendance Modal */}
      <Modal
        title="Add Attendance Record"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddAttendance}
          style={{ marginTop: 20 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Employee"
                name="employeeId"
                rules={[{ required: true, message: 'Please select employee!' }]}
              >
                <Select placeholder="Select Employee">
                  {employees.map(emp => (
                    <Option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Please select date!' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select placeholder="Select Status">
              <Option value="Present">Present</Option>
              <Option value="Absent">Absent</Option>
              <Option value="On Leave">On Leave</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Check In Time"
                name="checkIn"
                dependencies={['status']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('status') === 'Present' && !value) {
                        return Promise.reject(new Error('Check in time is required for present status!'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Check Out Time"
                name="checkOut"
                dependencies={['status']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('status') === 'Present' && !value) {
                        return Promise.reject(new Error('Check out time is required for present status!'));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                Add Record
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Attendance;
