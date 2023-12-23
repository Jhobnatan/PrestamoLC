const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const grupo_accesoController = require('../controllers/grupo_accesoController');

router.get('/', grupo_accesoController.list);
router.post('/add',grupo_accesoController.save);

router.get('/update/:id',grupo_accesoController.edit);
router.post('/update/:id',grupo_accesoController.update);

router.get('/accesos/:id',grupo_accesoController.accesos);
router.post('/accesos/:id',grupo_accesoController.accesos_save);

router.get('/delete/:id',grupo_accesoController.delete);

module.exports = router;