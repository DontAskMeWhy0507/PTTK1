const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, appointmentController.createAppointment);
router.get('/my', authMiddleware, appointmentController.getMyAppointments);
router.patch('/:id', authMiddleware, appointmentController.updateMyAppointment);

module.exports = router;
