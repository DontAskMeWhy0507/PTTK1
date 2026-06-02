const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);
router.post('/deposit-request', authMiddleware, propertyController.createDepositRequest);
router.post('/pay-deposit/:contract_id', authMiddleware, propertyController.payDeposit);

module.exports = router;
