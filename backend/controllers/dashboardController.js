const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total active employees
    const totalEmployees = await Employee.countDocuments({ isActive: true });

    // Count employees by role (Team Manager)
    const teamManagers = await Employee.countDocuments({ 
      isActive: true, 
      role: 'Team Manager' 
    });

    // Count employees by department
    const departmentStats = await Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Count employees by company
    const companyStats = await Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Count employees by status (Tourist/Resident)
    const statusStats = await Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$employeeStatus', count: { $sum: 1 } } }
    ]);

    // Get employee growth data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const growthData = await Employee.aggregate([
      { 
        $match: { 
          isActive: true,
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Format growth data for frontend
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedGrowth = growthData.map(item => ({
      name: monthNames[item._id.month - 1],
      employees: item.count,
      year: item._id.year
    }));

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        teamManagers,
        departmentStats,
        companyStats,
        statusStats,
        growthData: formattedGrowth
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};
