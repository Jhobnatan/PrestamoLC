
const express = require('express');
//const controller = require('../controllers/negocioController');
const router = express.Router();
const uploadFile = require('../middleware/multer');
const negocioController = require('../controllers/negocioController_old');

router.get('/', negocioController.list);

router.get('/new', negocioController.new);

router.post('/add',negocioController.save);

router.get('/licencia/:id',negocioController.licencia);
router.post('/licencia/:id',negocioController.guardar_lic);
router.get('/update/:id',negocioController.edit);
router.post('/update/:id',negocioController.update);
router.post('/out/:id',negocioController.out);
router.post('/activar/:id',negocioController.activar);

router.get('/usuario/:id',negocioController.edit_user);
router.post('/usuario/:id',negocioController.save_user);

router.get('/delete/:id',negocioController.delete);

router.get('/amonestacion/:id',negocioController.amonestacion);
router.post('/amonestacion/:id/:index',uploadFile,negocioController.guardar_amonestacion);

module.exports = router;