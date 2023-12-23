const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const css = require('../middleware/css');
const loginController = require('../controllers/loginController');

router.get('/', loginController.view);
router.post('/', loginController.log);
router.get('/logout', loginController.logout);

router.post('/autoriza', loginController.autoriza);

// router.post('/log/:id',customerController.log);



module.exports = router;