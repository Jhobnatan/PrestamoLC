const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const claseController = require('../controllers/claseController');

router.get('/', claseController.clase_list);
router.get('/filtro/:valor/:inicio', claseController.clase_list_filtro);
router.post('/save_or_update/:id/:nombre/:descripcion',claseController.clase_save_or_update);

router.get('/buscar_clase/:id',claseController.buscar_clase);


module.exports = router;