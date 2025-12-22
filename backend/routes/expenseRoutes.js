const express = require('express');
const router = express.Router();
const {
  getMyBudget,
  addExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const { protectManager } = require('../middleware/auth');

// All routes require manager authentication
router.use(protectManager);

router.get('/my-budget', getMyBudget);
router.post('/', addExpense);
router.put('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);

module.exports = router;
