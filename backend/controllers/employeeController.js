const Employee = require('../models/Employee');
const VisaCountry = require('../models/VisaCountry');

const DEFAULT_VISA_COUNTRIES = ['UAE', 'India', 'USA', 'UK', 'Canada'];

const normalizeCountryName = (country) => {
  if (typeof country !== 'string') {
    return '';
  }

  return country.trim();
};

const ensureVisaCountryExists = async (country, userId) => {
  const normalizedCountry = normalizeCountryName(country);

  if (!normalizedCountry) {
    return;
  }

  const existingCountry = await VisaCountry.findOne({
    name: { $regex: `^${normalizedCountry}$`, $options: 'i' }
  });

  if (!existingCountry) {
    await VisaCountry.create({
      name: normalizedCountry,
      createdBy: userId
    });
  }
};

const sanitizeEmployeePayload = (payload = {}) => {
  const sanitized = { ...payload };

  Object.keys(sanitized).forEach((field) => {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitized[field].trim();
      if (sanitized[field] === '') {
        sanitized[field] = undefined;
      }
    }

    if (field !== 'documents' && Array.isArray(sanitized[field]) && sanitized[field].length === 0) {
      sanitized[field] = undefined;
    }
  });

  if (Array.isArray(sanitized.countryOfVisaIssuance)) {
    sanitized.countryOfVisaIssuance = sanitized.countryOfVisaIssuance[0] || '';
  }

  sanitized.countryOfVisaIssuance = normalizeCountryName(sanitized.countryOfVisaIssuance);

  if (!sanitized.countryOfVisaIssuance) {
    sanitized.countryOfVisaIssuance = undefined;
  }

  if (Array.isArray(sanitized.documents)) {
    sanitized.documents = sanitized.documents
      .map((doc) => ({
        name: typeof doc?.name === 'string' ? doc.name.trim() : '',
        url: typeof doc?.url === 'string' ? doc.url.trim() : '',
        size: Number.isFinite(Number(doc?.size)) ? Number(doc.size) : undefined,
        type: typeof doc?.type === 'string' ? doc.type.trim() : undefined,
        uploadDate: doc?.uploadDate || undefined
      }))
      .filter((doc) => doc.name && doc.url);
  }

  if (typeof sanitized.salary === 'string') {
    const parsedSalary = Number(sanitized.salary);
    sanitized.salary = Number.isNaN(parsedSalary) ? sanitized.salary : parsedSalary;
  }

  return sanitized;
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employees',
      error: error.message
    });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee || !employee.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee',
      error: error.message
    });
  }
};

// @desc    Create new employee
// @route   POST /api/employees
// @access  Private (Admin/HR)
exports.createEmployee = async (req, res) => {
  try {
    req.body = sanitizeEmployeePayload(req.body);

    // Add created by user
    req.body.createdBy = req.user.id;

    console.log('Creating employee with data:', JSON.stringify(req.body, null, 2));
    console.log('Documents type:', typeof req.body.documents);
    console.log('Documents is array:', Array.isArray(req.body.documents));
    console.log('Documents value:', req.body.documents);

    await ensureVisaCountryExists(req.body.countryOfVisaIssuance, req.user.id);

    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Employee with this ${field} already exists`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Invalid employee data',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating employee',
      error: error.message
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin/HR)
exports.updateEmployee = async (req, res) => {
  try {
    req.body = sanitizeEmployeePayload(req.body);

    let employee = await Employee.findById(req.params.id);

    if (!employee || !employee.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await ensureVisaCountryExists(req.body.countryOfVisaIssuance, req.user.id);

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `Employee with this ${field} already exists`
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Invalid employee data',
        errors: messages
      });
    }

    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee id'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
};

// @desc    Get visa countries for dropdown
// @route   GET /api/employees/visa-countries
// @access  Private
exports.getVisaCountries = async (req, res) => {
  try {
    const countriesFromDb = await VisaCountry.find({}).sort({ name: 1 });

    const combinedCountries = [
      ...DEFAULT_VISA_COUNTRIES,
      ...countriesFromDb.map((country) => country.name)
    ];

    const uniqueCountries = [...new Set(combinedCountries.map((country) => normalizeCountryName(country)).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      success: true,
      data: uniqueCountries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching visa countries',
      error: error.message
    });
  }
};

// @desc    Delete employee (soft delete)
// @route   DELETE /api/employees/:id
// @access  Private (Admin/HR)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Hard delete - permanently remove from database
    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message
    });
  }
};

// @desc    Search employees
// @route   GET /api/employees/search
// @access  Private
exports.searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const employees = await Employee.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { employeeCode: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { department: { $regex: query, $options: 'i' } },
        { role: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching employees',
      error: error.message
    });
  }
};
