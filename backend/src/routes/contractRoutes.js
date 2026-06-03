const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contractController');
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/deposit', authMiddleware, contractController.getMyDepositContracts);
router.get('/deposit/:id', authMiddleware, contractController.getDepositContractDetail);
router.post('/deposit/:id/cancel', authMiddleware, contractController.cancelDepositContract);
router.post('/refunds/:refundId/process', authMiddleware, contractController.processRefund);
router.get('/transactions', authMiddleware, contractController.getTransactionLogs);
router.get('/rental/my', authMiddleware, contractController.getMyRentalContracts);
router.get('/rental/:id', authMiddleware, contractController.getRentalContractDetail);
router.post('/rental/:id/pay', authMiddleware, employeeController.payRent);
router.get('/documents/:documentId', authMiddleware, contractController.downloadContractDocument);
router.get('/:type/:id/documents', authMiddleware, contractController.listContractDocuments);
router.post('/:type/:id/documents', authMiddleware, contractController.uploadContractDocument);

module.exports = router;
