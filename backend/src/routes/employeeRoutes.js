const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/appointments', authMiddleware, employeeController.getAppointments);
router.patch('/appointments/:id', authMiddleware, employeeController.updateAppointmentStatus);
router.get('/commissions', authMiddleware, employeeController.getCommissions);
router.get('/contracts/rental', authMiddleware, employeeController.getClosedRentalContracts);
router.post('/contracts/rental', authMiddleware, employeeController.createRentalContract);
router.get('/interactions', authMiddleware, employeeController.getInteractions);
router.post('/interactions', authMiddleware, employeeController.logInteraction);
router.patch('/properties/:id/review', authMiddleware, employeeController.updatePropertyReview);

module.exports = router;
