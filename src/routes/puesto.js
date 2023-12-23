const express = require('express');
//const controller = require('../controllers/posicionController');
const router = express.Router();
const posicionController = require('../controllers/puestoController');

router.get('/', posicionController.list);
router.post('/add',posicionController.save);

router.get('/update/:id',posicionController.edit);
router.post('/update/:id',posicionController.update);

router.get('/delete/:id',posicionController.delete);

module.exports = router;