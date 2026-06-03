const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', propertyController.getAllProperties);
router.get('/broker/available', authMiddleware, propertyController.getAvailableForBrokers);
router.get('/broker/managed', authMiddleware, propertyController.getBrokerManagedProperties);
router.get('/:id', propertyController.getPropertyById);
router.post('/deposit-request', authMiddleware, propertyController.createDepositRequest);
router.post('/customer-pay-deposit/:contract_id', authMiddleware, propertyController.customerPayDeposit);
router.post('/staff-sign-contract/:contract_id', authMiddleware, propertyController.staffSignContract);
router.post('/:id/claim', authMiddleware, propertyController.claimProperty);

module.exports = router;
