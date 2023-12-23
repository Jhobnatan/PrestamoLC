const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const marcaController = require('../controllers/marcaController');

router.get('/', marcaController.marca_list);
router.get('/filtro/:valor/:inicio', marcaController.marca_list_filtro);
router.post('/save_or_update/:id/:nombre/:descripcion',marcaController.marca_save_or_update);

router.get('/buscar_marca/:id',marcaController.buscar_marca);


module.exports = router;