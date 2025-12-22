const TeamManager = require('../models/TeamManager');
exports.getMyBudget = async (req, res) => {
  try {
    const managerId = req.user.id;
    
    const manager = await TeamManager.findById(managerId)
      .populate('employee', 'name employeeCode department');
    
    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Manager not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        budgetAllocated: manager.budgetAllocated,
        budgetUsed: manager.budgetUsed,
        balanceRemaining: manager.balanceRemaining,
        expenses: manager.expenses,
        teamName: manager.teamName,
        employee: manager.employee
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching budget data',
      error: error.message
    });
  }
};

// @desc    Add new expense
// @route   POST /api/expenses
// @access  Private (Manager)
exports.addExpense = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { description, amount, category, date, notes } = req.body;

    // Validate required fields
    if (!description || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide description, amount, and category'
      });
    }

    const manager = await TeamManager.findById(managerId);
    
    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Manager not found'
      });
    }

    // Check if expense exceeds remaining budget
    const currentUsed = manager.budgetUsed;
    const newTotal = currentUsed + parseFloat(amount);
    
    if (newTotal > manager.budgetAllocated) {
      return res.status(400).json({
        success: false,
        message: `Expense exceeds budget. Remaining: $${manager.balanceRemaining.toFixed(2)}`
      });
    }

    // Add expense
    manager.expenses.push({
      description,
      amount: parseFloat(amount),
      category,
      date: date || Date.now(),
      notes: notes || ''
    });

    await manager.save();

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: {
        budgetAllocated: manager.budgetAllocated,
        budgetUsed: manager.budgetUsed,
        balanceRemaining: manager.balanceRemaining,
        expenses: manager.expenses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding expense',
      error: error.message
    });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:expenseId
// @access  Private (Manager)
exports.updateExpense = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { expenseId } = req.params;
    const { description, amount, category, date, notes } = req.body;

    const manager = await TeamManager.findById(managerId);
    
    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Manager not found'
      });
    }

    const expense = manager.expenses.id(expenseId);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Calculate budget impact
    const oldAmount = expense.amount;
    const newAmount = parseFloat(amount);
    const budgetDifference = newAmount - oldAmount;
    const currentUsed = manager.budgetUsed;
    
    if (currentUsed + budgetDifference > manager.budgetAllocated) {
      return res.status(400).json({
        success: false,
        message: 'Updated amount exceeds budget'
      });
    }

    // Update expense
    expense.description = description || expense.description;
    expense.amount = newAmount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.notes = notes !== undefined ? notes : expense.notes;

    await manager.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: {
        budgetAllocated: manager.budgetAllocated,
        budgetUsed: manager.budgetUsed,
        balanceRemaining: manager.balanceRemaining,
        expenses: manager.expenses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating expense',
      error: error.message
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:expenseId
// @access  Private (Manager)
exports.deleteExpense = async (req, res) => {
  try {
    const managerId = req.user.id;
    const { expenseId } = req.params;

    const manager = await TeamManager.findById(managerId);
    
    if (!manager) {
      return res.status(404).json({
        success: false,
        message: 'Manager not found'
      });
    }

    const expense = manager.expenses.id(expenseId);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    expense.deleteOne();
    await manager.save();

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: {
        budgetAllocated: manager.budgetAllocated,
        budgetUsed: manager.budgetUsed,
        balanceRemaining: manager.balanceRemaining,
        expenses: manager.expenses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting expense',
      error: error.message
    });
  }
};
