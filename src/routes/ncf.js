const express = require('express');
//const controller = require('../controllers/customerController');
const router = express.Router();
const ncfController = require('../controllers/ncfController');

router.get('/', ncfController.list);
router.get('/filtro/:valor/:inicio', ncfController.ncf_list_filtro);
router.post('/save_or_update',ncfController.save_or_update);

router.get('/buscar_ncf/:id',ncfController.edit);


router.get('/secuenciaList/:codigoNCF/:estadoSecuencia/:valor/:inicio', ncfController.secuenciaList);
router.post('/saveSecuencia',ncfController.saveSecuencia);

router.post('/update/:id',ncfController.update);

router.get('/comprobarDisponibilidadDeSecuencia/:codigoNCF',ncfController.cantidadDeSecuenciaDisponible);
router.get('/secuenciaInicial/:codigoNCF',ncfController.secuenciaInicial);

router.get('/delete/:id',ncfController.delete);

module.exports = router;