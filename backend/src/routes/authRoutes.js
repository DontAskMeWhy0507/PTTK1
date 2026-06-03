const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');

router.post('/register', optionalAuthMiddleware, authController.register);
router.post('/login', authController.login);
router.get('/users', authMiddleware, authController.getUsers);
router.patch('/users/:id', authMiddleware, authController.adminUpdateUser);
router.patch('/users/:id/role', authMiddleware, authController.updateUserRole);

module.exports = router;
