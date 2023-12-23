const express = require('express');
//const controller = require('../controllers/posicionController');
const router = express.Router();
const uploadFile = require('../middleware/multer');
const amonestacionController = require('../controllers/amonestacionController');



router.get('/', amonestacionController.veramonestacion);
router.get('/rrhh/:id/:am',amonestacionController.amonestacion);
router.post('/rrhh/:id/:am',uploadFile,amonestacionController.actualizar_am);



module.exports = router;