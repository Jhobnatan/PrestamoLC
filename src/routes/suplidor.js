const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const suplidorController = require('../controllers/suplidorController');

router.get('/', suplidorController.suplidor_list);
router.get('/filtro/:valor/:inicio', suplidorController.suplidor_list_filtro);
router.post('/save_or_update/:id/:empresa_sup/:direccion_sup/:rnc_sup/:representante/:flota/:telefono/:extension',suplidorController.suplidor_save_or_update);

router.get('/buscar_suplidor/:id',suplidorController.buscar_suplidor);


module.exports = router;