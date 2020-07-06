const express = require('express');
const router = express.Router();
// var userController = require('../controllers/');
var authController = require('../controllers/authController');

//User Registration and Login Route
router.post('/signup', authController.signup("user"))
router.post('/login',authController.login("user"))

//Admin Registration and Login Route
router.post('/admin-signup', authController.signup("admin"))
router.post('/admin-login',authController.login("admin"))

//Admin Protected Route for Deleting User
router.delete('/delete-user/:id',authController.protect, authController.deleteUser)

//Forgot and Reset Route
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;

