const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.get('/', categoriaController.categoria_list);
router.get('/filtro/:valor/:inicio', categoriaController.categoria_list_filtro);
router.post('/save_or_update/:id/:nombre/:descripcion',categoriaController.categoria_save_or_update);

router.get('/buscar_categoria/:id',categoriaController.buscar_categoria);


module.exports = router;