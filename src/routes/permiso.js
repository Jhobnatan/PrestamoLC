const express = require('express');
//const controller = require('../controllers/posicionController');
const router = express.Router();
const permisoController = require('../controllers/permisoController');

router.get('/solicitud', permisoController.list);
router.get('/', permisoController.solicitud);
router.get('/:id', permisoController.solicitud);

router.post('/add',permisoController.save);

router.get('/ver/:id',permisoController.ver);
router.get('/rrhh/:id',permisoController.vertodos);
router.get('/update/:id',permisoController.edit);
router.post('/updateenc/:id',permisoController.update);
router.post('/updaterrhh/:id',permisoController.updaterrhh);
router.post('/cancel/:id',permisoController.cancel);
// router.get('/delete/:id',permisoController.delete);

module.exports = router;