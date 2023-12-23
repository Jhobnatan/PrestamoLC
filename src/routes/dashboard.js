const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.show);

module.exports = router;
