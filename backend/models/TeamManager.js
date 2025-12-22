const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Expense description is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Expense amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Equipment', 'Software', 'Training', 'Travel', 'Supplies', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const teamManagerSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
    unique: true
  },
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  budgetAllocated: {
    type: Number,
    required: [true, 'Budget allocated is required'],
    min: 0,
    default: 0
  },
  expenses: [expenseSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for total budget used
teamManagerSchema.virtual('budgetUsed').get(function() {
  return this.expenses.reduce((total, expense) => total + expense.amount, 0);
});

// Virtual for balance remaining
teamManagerSchema.virtual('balanceRemaining').get(function() {
  return this.budgetAllocated - this.budgetUsed;
});

// Ensure virtuals are included in JSON
teamManagerSchema.set('toJSON', { virtuals: true });
teamManagerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TeamManager', teamManagerSchema);
