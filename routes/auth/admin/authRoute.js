const express = require('express');
const authController = require('../../../controllers/auth/admin/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authController.getUserData);

module.exports = router;
