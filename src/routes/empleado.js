
const express = require('express');
//const controller = require('../controllers/empleadoController');
const router = express.Router();
const uploadFile = require('../middleware/multer');
const empleadoController = require('../controllers/empleadoController');

router.get('/', empleadoController.list);

router.get('/new', empleadoController.new);

router.post('/add',empleadoController.save);

router.get('/licencia/:id',empleadoController.licencia);
router.post('/licencia/:id',empleadoController.guardar_lic);
router.get('/update/:id',empleadoController.edit);
router.post('/update/:id/:index',uploadFile,empleadoController.update);
router.post('/foto/:id/:index',uploadFile,empleadoController.foto_empleado);
router.post('/out/:id',empleadoController.out);
router.post('/activar/:id',empleadoController.activar);

router.get('/usuario/:id',empleadoController.edit_user);
router.post('/usuario/:id',empleadoController.save_user);

router.get('/delete/:id',empleadoController.delete);

router.get('/amonestacion/:id',empleadoController.amonestacion);
router.post('/amonestacion/:id/:index',uploadFile,empleadoController.guardar_amonestacion);

module.exports = router;