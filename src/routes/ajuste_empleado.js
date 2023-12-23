
const express = require('express');
//const controller = require('../controllers/ajuste_empleadoController');
const router = express.Router();
const uploadFile = require('../middleware/multer');
const ajuste_empleadoController = require('../controllers/ajuste_empleadoController');

router.get('/', ajuste_empleadoController.list);

router.get('/new', ajuste_empleadoController.new);

router.post('/add',ajuste_empleadoController.save);

router.get('/update/:id',ajuste_empleadoController.edit);
router.post('/update/:id',ajuste_empleadoController.update);
router.get('/historial/:id/:inicio',ajuste_empleadoController.historial);

router.get('/sucursal/:id',ajuste_empleadoController.sucursal);
router.get('/sucursal/new/:id',ajuste_empleadoController.sucursal_new);
router.post('/sucursal/add/:id',ajuste_empleadoController.sucursal_save);
router.get('/sucursal_update/:id/:su',ajuste_empleadoController.sucursal_edit);
router.post('/sucursal/update/:id/:su',ajuste_empleadoController.sucursal_update);

router.get('/sucursal/historial/:id/:su/:inicio/:razon_social',ajuste_empleadoController.sucursal_historial);

router.get('/delete/:id',ajuste_empleadoController.delete);

module.exports = router;