
const express = require('express');
//const controller = require('../controllers/clienteController');
const router = express.Router();
const uploadFile = require('../middleware/multer');

const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.list);
router.get('/filtro_list/:sucursal/:cartera/:estado/:inicio/:valor', clienteController.filtro_list);

router.get('/new', clienteController.new);

router.post('/add',clienteController.save);

router.get('/update/:id',clienteController.edit);
router.post('/update/:id/:index',uploadFile,clienteController.update);
router.post('/foto/:id/:index',uploadFile,clienteController.foto_cliente);

router.get('/licencia/:id',clienteController.licencia);
router.post('/licencia/:id',clienteController.guardar_lic);


router.post('/out/:id',clienteController.out);
router.post('/activar/:id',clienteController.activar);

router.get('/usuario/:id',clienteController.edit_user);
router.post('/usuario/:id',clienteController.save_user);

router.get('/delete/:id',clienteController.delete);

router.get('/amonestacion/:id',clienteController.amonestacion);
router.post('/amonestacion/:id/:index',uploadFile,clienteController.guardar_amonestacion);

module.exports = router;