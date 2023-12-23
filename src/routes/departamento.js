const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const departamentoController = require('../controllers/departamentoController');

router.get('/', departamentoController.list);
router.post('/add',departamentoController.save);

router.get('/update/:id',departamentoController.edit);
router.post('/update/:id',departamentoController.update);

router.get('/delete/:id',departamentoController.delete);

module.exports = router;