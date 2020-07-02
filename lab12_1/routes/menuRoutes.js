const express = require("express");
const menuController = require('./../controllers/menuController');
const authController = require("./../controllers/authController");


const router = express.Router();
//router.route('/',errorController)
router.route('/top5deals').get(menuController.TopDeals,menuController.findAllMenus);
router.route('/monthly-plan/:year').get(menuController.monthlyPlan);


// router.route('/').get(menuController.findAllMenus).post(menuController.createMenu);
// router.route('/:id').get(menuController.findMenu).patch(menuController.updateMenu);


router.route('/').get(menuController.findAllMenus).post(authController.protect, menuController.createMenu);
router.route('/:id').get(menuController.findMenu).patch(authController.protect, menuController.updateMenu);

//router.route().get(menuController.wrongroute);
//router.route('/')
module.exports = router;