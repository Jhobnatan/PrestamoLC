const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const customerController = require('../controllers/empresaController');

router.get('/', customerController.list);
router.post('/add',customerController.save);

router.get('/update/:id',customerController.edit);
router.post('/update/:id',customerController.update);

router.get('/delete/:id',customerController.delete);

module.exports = router;