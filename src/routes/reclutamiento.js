
const express = require('express');
//const controller = require('../controllers/reclutamientoController');
const router = express.Router();
const uploadFile = require('../middleware/multer');
const reclutamientoController = require('../controllers/reclutamientoController');

router.get('/', reclutamientoController.list);
router.get('/rrhh', reclutamientoController.list_rrhh);

router.get('/new', reclutamientoController.new);

router.post('/add',reclutamientoController.save);


router.get('/update/:id',reclutamientoController.edit);
router.post('/update/:id',reclutamientoController.update);

router.get('/update_rrhh/:id',reclutamientoController.edit_rrhh);
router.post('/update_rrhh/:id',reclutamientoController.update_rrhh);

router.post('/out/:id',reclutamientoController.out);
router.post('/activar/:id',reclutamientoController.activar);

router.get('/delete/:id',reclutamientoController.delete);


module.exports = router;