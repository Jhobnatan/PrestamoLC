const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const cajaController = require('../controllers/cajaController');

router.get('/', cajaController.caja_list);
router.get('/filtro/:valor/:inicio', cajaController.caja_list_filtro);
router.post('/save_or_update/:id/:nombre/:descripcion',cajaController.caja_save_or_update);

router.get('/editar_caja/:id',cajaController.editar_caja);
router.get('/buscar_caja/:id',cajaController.buscar_caja);

router.post('/asignar',cajaController.asignarCaja);
 

module.exports = router;