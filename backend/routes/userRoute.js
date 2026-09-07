const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const auth = require('../middelware/auth.js');
const upload = require('../middelware/upload.js');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/google-login', userController.googleLogin);
router.post('/logout', userController.logout);
router.get('/profile', auth, userController.getProfile);
router.put("/updateprofile", auth, upload.single("profileImage"), userController.updateProfile);
router.put('/change-password', auth, userController.changePassword);
router.get('/customers', auth, userController.getAllCustomers);
router.get('/customer/:id', auth, userController.getCustomerById);
router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-otp", userController.verifyOTP);
router.post("/reset-password", userController.resetPassword);

module.exports = router;
