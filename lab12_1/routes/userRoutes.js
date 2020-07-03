const express = require('express');
const router = express.Router();
// var userController = require('../controllers/');
var authController = require('../controllers/authController');
router.post('/signup',authController.signup)
router.post('/login',authController.login)
//router.get('/', obj2.GetTeamInfo );
//router.route('/').post(userController.createuser)
module.exports = router;

