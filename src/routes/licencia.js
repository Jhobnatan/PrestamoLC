const express = require('express');
//const controller = require('../controllers/posicionController');
const router = express.Router();
const uploadFile = require('../middleware/multer');
const licenciaController = require('../controllers/licenciaController');



router.get('/', licenciaController.verlicencias);
router.get('/rrhh/:id/:li',licenciaController.licencia);
router.post('/rrhh/:id/:li/:index',uploadFile,licenciaController.actualizar_lic);



module.exports = router;